import {Jam} from '../../model/jam-rest-data';
import {ArtworkImageType, RootScanStrategy, TrackHealthID} from '../../model/jam-types';
import {AudioModule} from '../../modules/audio/audio.module';
import {ImageModule} from '../../modules/image/image.module';
import {Root} from '../root/root.model';
import {Store} from '../store/store';
import {WaveformService} from '../waveform/waveform.service';
import {Changes} from './changes/changes';
import {MatchDirBuilderDB} from './match-dir/match-dir.builder.db';
import {ArtworkWorker} from './tasks/worker.artwork';
import {ChangesWorker} from './tasks/worker.changes';
import {FolderWorker} from './tasks/worker.folder';
import {RootWorker} from './tasks/worker.root';
import {TrackWorker} from './tasks/worker.track';

export interface WorkerRequestParameters {
	rootID: string;
}

export interface WorkerRequestMoveTracks extends WorkerRequestParameters {
	trackIDs: Array<string>;
	newParentID: string;
}

export interface WorkerRequestRenameTrack extends WorkerRequestParameters {
	trackID: string;
	newName: string;
}

export interface WorkerRequestFixTrack extends WorkerRequestParameters {
	trackID: string;
	fixID: TrackHealthID;
}

export interface WorkerRequestRenameFolder extends WorkerRequestParameters {
	folderID: string;
	newName: string;
}

export interface WorkerRequestCreateFolder extends WorkerRequestParameters {
	parentID: string;
	name: string;
}

export interface WorkerRequestUpdateRoot extends WorkerRequestParameters {
	name: string;
	path: string;
	strategy: RootScanStrategy;
}

export interface WorkerRequestCreateRoot extends WorkerRequestParameters {
	path: string;
	name: string;
	strategy: RootScanStrategy;
}

export interface WorkerRequestWriteTrackTags extends WorkerRequestParameters {
	tags: Array<{ trackID: string; tag: Jam.RawTag }>;
}

export interface WorkerRequestRefreshRoot extends WorkerRequestParameters {
	forceMetaRefresh: boolean;
}

export interface WorkerRequestRefreshFolders extends WorkerRequestParameters {
	folderIDs: Array<string>;
}

export interface WorkerRequestMoveFolders extends WorkerRequestParameters {
	newParentID: string;
	folderIDs: Array<string>;
}

export interface WorkerRequestRemoveRoot extends WorkerRequestParameters {
}

export interface WorkerRequestRefreshTracks extends WorkerRequestParameters {
	trackIDs: Array<string>;
}

export interface WorkerRequestRemoveTracks extends WorkerRequestParameters {
	trackIDs: Array<string>;
}

export interface WorkerRequestDeleteFolders extends WorkerRequestParameters {
	folderIDs: Array<string>;
}

export interface WorkerRequestDeleteArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkID: string;
}

export interface WorkerRequestDownloadArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkURL: string;
	types: Array<ArtworkImageType>;
}

export interface WorkerRequestUpdateArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkID: string;
	artworkFilename: string;
	artworkMimeType: string;
}

export interface WorkerRequestCreateArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkFilename: string;
	artworkMimeType: string;
	types: Array<ArtworkImageType>;
}

export interface WorkerRequestRenameArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkID: string;
	name: string;
}

export class WorkerService {
	private settings: Jam.AdminSettingsLibrary = {
		scanAtStart: true
	};
	private artwork: ArtworkWorker;
	private track: TrackWorker;
	private folder: FolderWorker;
	private root: RootWorker;
	private changes: ChangesWorker;

	constructor(private store: Store, private audioModule: AudioModule, private imageModule: ImageModule, private waveformService: WaveformService) {
		this.artwork = new ArtworkWorker(store, imageModule);
		this.track = new TrackWorker(store, imageModule, audioModule);
		this.folder = new FolderWorker(store, imageModule, audioModule);
		this.root = new RootWorker(store);
		this.changes = new ChangesWorker(store, audioModule, imageModule, waveformService, this.settings);
	}

	public setSettings(settings: Jam.AdminSettingsLibrary): void {
		this.settings = settings;
		this.changes.settings = settings;
	}

	private async mergeDBMatch(root: Root, folderIDs: Array<string>, trackIDs: Array<string>, changes: Changes): Promise<void> {
		const dbMatcher = new MatchDirBuilderDB(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.build(folderIDs, trackIDs);
		await this.changes.mergeMatch(root, rootMatch, dir => changedDirs.includes(dir), changes);
	}

	// root

	async refreshRoot(parameters: WorkerRequestRefreshRoot): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {rootMatch, removedFolders, removedTracks} = await this.root.scan(root);
		changes.removedFolders = removedFolders;
		changes.removedTracks = removedTracks;
		await this.changes.mergeMatch(root, rootMatch, () => true, changes);
		return this.changes.finish(changes, root.id, parameters.forceMetaRefresh);
	}

	async updateRoot(parameters: WorkerRequestUpdateRoot): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const forceRefreshMeta = root.strategy !== parameters.strategy;
		const {rootMatch, removedFolders, removedTracks} = await this.root.update(root, parameters.name, parameters.path, parameters.strategy);
		changes.removedFolders = removedFolders;
		changes.removedTracks = removedTracks;
		await this.changes.mergeMatch(root, rootMatch, () => true, changes);
		return this.changes.finish(changes, root.id, forceRefreshMeta);
	}

	async createRoot(parameters: WorkerRequestCreateRoot): Promise<Changes> {
		const {root} = await this.root.create(parameters.name, parameters.path, parameters.strategy);
		const {changes} = await this.changes.start(root.id);
		return this.changes.finish(changes, root.id, false);
	}

	async removeRoot(parameters: WorkerRequestRemoveRoot): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {removedFolders, removedTracks} = await this.root.remove(root);
		changes.removedFolders = removedFolders;
		changes.removedTracks = removedTracks;
		await this.mergeDBMatch(root, [], [], changes);
		return this.changes.finish(changes, root.id, false);
	}

	// folder

	async deleteFolders(parameters: WorkerRequestDeleteFolders): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {removedFolders, removedTracks, changedFolderIDs, changedTrackIDs} = await this.folder.delete(root, parameters.folderIDs);
		changes.removedFolders = removedFolders;
		changes.removedTracks = removedTracks;
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async refreshFolders(parameters: WorkerRequestRefreshFolders): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.mergeDBMatch(root, parameters.folderIDs, [], changes);
		return this.changes.finish(changes, root.id, false);
	}

	async createFolder(parameters: WorkerRequestCreateFolder): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {folder} = await this.folder.create(parameters.parentID, name);
		changes.newFolders.push(folder);
		return this.changes.finish(changes, root.id, false);
	}

	async moveFolders(parameters: WorkerRequestMoveFolders): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.folder.move(parameters.newParentID, parameters.folderIDs);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async renameFolder(parameters: WorkerRequestRenameFolder): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.folder.rename(parameters.folderID, parameters.newName);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	// tracks

	async refreshTracks(parameters: WorkerRequestRefreshTracks): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.track.refresh(parameters.trackIDs);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async removeTracks(parameters: WorkerRequestRemoveTracks): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs, removedTracks} = await this.track.delete(root, parameters.trackIDs);
		changes.removedTracks = removedTracks;
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async moveTracks(parameters: WorkerRequestMoveTracks): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.track.move(parameters.trackIDs, parameters.newParentID);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async renameTrack(parameters: WorkerRequestRenameTrack): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.track.rename(parameters.trackID, parameters.newName);
		return this.changes.finish(changes, root.id, false);
	}

	async fixTrack(parameters: WorkerRequestFixTrack): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.track.fix(parameters.trackID, parameters.fixID);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async writeTrackTags(parameters: WorkerRequestWriteTrackTags): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.track.writeTags(parameters.tags);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	// artworks

	async renameArtwork(parameters: WorkerRequestRenameArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artwork.rename(parameters.folderID, parameters.artworkID, name, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async createArtwork(parameters: WorkerRequestCreateArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artwork.create(parameters.folderID, parameters.artworkFilename, parameters.artworkMimeType, parameters.types, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async updateArtwork(parameters: WorkerRequestUpdateArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artwork.update(parameters.folderID, parameters.artworkID, parameters.artworkFilename, parameters.artworkMimeType, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async downloadArtwork(parameters: WorkerRequestDownloadArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artwork.download(parameters.folderID, parameters.folderID, parameters.artworkURL, parameters.types, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async deleteArtwork(parameters: WorkerRequestDeleteArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artwork.delete(parameters.folderID, parameters.artworkID, changes);
		return this.changes.finish(changes, root.id, false);
	}
}
