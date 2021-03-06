import fse from 'fs-extra';
import path from 'path';
import {Jam} from '../../../model/jam-rest-data';
import {TrackHealthID} from '../../../model/jam-types';
import {AudioModule} from '../../../modules/audio/audio.module';
import {ImageModule} from '../../../modules/image/image.module';
import {ensureTrailingPathSeparator, fileExt, replaceFileSystemChars} from '../../../utils/fs-utils';
import {Root} from '../../root/root.model';
import {Store} from '../../store/store';
import {Track} from '../../track/track.model';
import {processQueue} from '../../../utils/queue';

export class TrackWorker {

	constructor(private store: Store, private imageModule: ImageModule, private audioModule: AudioModule) {

	}

	public async writeTags(tags: Array<{ trackID: string; tag: Jam.RawTag }>): Promise<{ changedFolderIDs: Array<string>; changedTrackIDs: Array<string> }> {
		const changedTrackIDs = [];
		const tracks = await this.store.trackStore.byIds(tags.map(t => t.trackID));
		const changedFolderIDs: Array<string> = [];
		for (const track of tracks) {
			const tag = tags.find(t => t.trackID === track.id);
			if (tag) {
				changedTrackIDs.push(track.id);
				const filename = path.join(track.path, track.name);
				await this.audioModule.writeRawTag(filename, tag.tag);
				if (!changedFolderIDs.includes(track.parentID)) {
					changedFolderIDs.push(track.parentID);
				}
			}
		}
		return {changedTrackIDs, changedFolderIDs};
	}

	public async fix(fixes: Array<{ trackID: string; fixID: TrackHealthID }>): Promise<{ changedFolderIDs: Array<string>; changedTrackIDs: Array<string> }> {
		const changedFolderIDs = new Set<string>();
		const changedTrackIDs = new Set<string>();
		const tracks = await this.store.trackStore.byIds(fixes.map(t => t.trackID));
		const fixTasks: Array<{ filename: string; fixIDs: Array<TrackHealthID> }> = [];
		for (const track of tracks) {
			changedTrackIDs.add(track.id);
			changedFolderIDs.add(track.parentID);
			fixTasks.push({filename: path.join(track.path, track.name), fixIDs: fixes.filter(f => f.trackID === track.id).map(f => f.fixID)});
		}
		await processQueue<{ filename: string; fixIDs: Array<TrackHealthID> }>(3, fixTasks, async item => {
			for (const fixID of item.fixIDs) {
				if ([TrackHealthID.mp3HeaderExists, TrackHealthID.mp3HeaderValid].includes(fixID)) {
					await this.audioModule.mp3.rewrite(item.filename);
				} else if ([TrackHealthID.mp3Garbage, TrackHealthID.mp3MediaValid].includes(fixID)) {
					await this.audioModule.mp3.fixAudio(item.filename);
				} else if ([TrackHealthID.id3v2NoId3v1].includes(fixID)) {
					await this.audioModule.mp3.removeID3v1(item.filename);
				}
			}
		});
		return {changedFolderIDs: [...changedFolderIDs], changedTrackIDs: [...changedTrackIDs]};
	}

	public async rename(trackID: string, newName: string): Promise<void> {
		const name = replaceFileSystemChars(newName, '').trim();
		if (name.length === 0) {
			return Promise.reject(Error('Invalid Name'));
		}
		const track = await this.store.trackStore.byId(trackID);
		if (!track) {
			return Promise.reject(Error('Track not found'));
		}
		const ext = fileExt(name);
		const ext2 = fileExt(track.name);
		if (ext !== ext2) {
			return Promise.reject(Error(`Changing File extension not supported ${ext}=>${ext2}`));
		}
		const newPath = path.join(track.path, name);
		const exists = await fse.pathExists(newPath);
		if (exists) {
			return Promise.reject(Error('File already exists'));
		}
		await fse.rename(path.join(track.path, track.name), path.join(track.path, name));
		track.name = name;
		await this.store.trackStore.replace(track);
	}

	public async delete(root: Root, trackIDs: Array<string>): Promise<{ changedFolderIDs: Array<string>; changedTrackIDs: Array<string>; removedTracks: Array<Track> }> {
		const removedTracks = await this.store.trackStore.byIds(trackIDs);
		const trashPath = path.join(root.path, '.trash');
		for (const track of removedTracks) {
			await fse.move(path.join(track.path, track.name), path.join(trashPath, `${Date.now()}_${track.name}`));
		}
		const changedFolderIDs: Array<string> = [];
		for (const track of removedTracks) {
			if (!changedFolderIDs.includes(track.parentID)) {
				changedFolderIDs.push(track.parentID);
			}
		}
		return {changedFolderIDs, changedTrackIDs: [], removedTracks};
	}

	public async move(trackIDs: Array<string>, newParentID: string): Promise<{ changedFolderIDs: Array<string>; changedTrackIDs: Array<string> }> {
		const tracks = await this.store.trackStore.byIds(trackIDs);
		const newParent = await this.store.folderStore.byId(newParentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		for (const track of tracks) {
			if (track.parentID === newParentID) {
				return Promise.reject(Error('File is already in folder'));
			}
			if (await fse.pathExists(path.join(newParent.path, track.name))) {
				return Promise.reject(Error('File name is already used in folder'));
			}
		}
		const changedFolderIDs: Array<string> = [newParent.id];
		const changedTrackIDs: Array<string> = [];
		for (const track of tracks) {
			changedTrackIDs.push(track.id);
			if (!changedFolderIDs.includes(track.parentID)) {
				changedFolderIDs.push(track.parentID);
			}
			await fse.move(path.join(track.path, track.name), path.join(newParent.path, track.name));
			track.path = ensureTrailingPathSeparator(newParent.path);
			track.rootID = newParent.rootID;
			track.parentID = newParent.id;
		}
		await this.store.trackStore.replaceMany(tracks);
		return {changedTrackIDs, changedFolderIDs};
	}

	public async refresh(trackIDs: Array<string>): Promise<{ changedFolderIDs: Array<string>; changedTrackIDs: Array<string> }> {
		const tracks = await this.store.trackStore.byIds(trackIDs);
		const changedFolderIDs: Array<string> = [];
		const changedTrackIDs: Array<string> = [];
		for (const track of tracks) {
			if (!changedTrackIDs.includes(track.id)) {
				changedTrackIDs.push(track.id);
			}
			if (!changedFolderIDs.includes(track.parentID)) {
				changedFolderIDs.push(track.parentID);
			}
		}
		return {changedFolderIDs, changedTrackIDs};
	}
}
