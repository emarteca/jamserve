import {Artwork, Folder} from './folder.model';
import {FolderStore, SearchQueryFolder} from './folder.store';
import {containsFolderSystemChars, ensureTrailingPathSeparator, fileDeleteIfExists, replaceFolderSystemChars} from '../../utils/fs-utils';
import {TrackStore} from '../track/track.store';
import path from 'path';
import fse from 'fs-extra';
import Logger from '../../utils/logger';
import {IApiBinaryResult} from '../../typings';
import {ArtworkImageType, FolderType, FolderTypeImageName} from '../../model/jam-types';
import {ImageModule} from '../../modules/image/image.module';
import {BaseListService} from '../base/base.list.service';
import {StateService} from '../state/state.service';
import {generateArtworkId} from '../../engine/scan/scan.service';
import {artWorkImageNameToType} from './folder.format';

const log = Logger('FolderService');

export class FolderService extends BaseListService<Folder, SearchQueryFolder> {

	constructor(public folderStore: FolderStore, private trackStore: TrackStore, stateService: StateService, public imageModule: ImageModule) {
		super(folderStore, stateService);
	}

	async renameFolder(folder: Folder, name: string): Promise<void> {
		if (containsFolderSystemChars(name)) {
			return Promise.reject(Error('Invalid Folder Name'));
		}
		name = replaceFolderSystemChars(name, '').trim();
		if (name.length === 0 || ['.', '..'].indexOf(name) >= 0) {
			return Promise.reject(Error('Invalid Folder Name'));
		}
		const p = path.dirname(folder.path);
		const newPath = path.join(p, name);
		const exists = await fse.pathExists(newPath);
		if (exists) {
			return Promise.reject(Error('Directory already exists'));
		}
		await fse.rename(folder.path, newPath);
		const folders = await this.folderStore.search({inPath: folder.path});
		for (const f of folders) {
			const rest = f.path.slice(folder.path.length - 1);
			if (rest.length > 0 && rest[0] !== path.sep) {
				log.error('WRONG inPath MATCH', rest, folder.path, f.path);
			} else {
				f.path = newPath + ensureTrailingPathSeparator(rest);
				await this.folderStore.replace(f);
			}
		}
		const tracks = await this.trackStore.search({inPath: folder.path});
		for (const t of tracks) {
			t.path = t.path.replace(folder.path, ensureTrailingPathSeparator(newPath));
			await this.trackStore.replace(t);
		}
		folder.path = ensureTrailingPathSeparator(newPath);
	}

	async collectFolderPath(folderId: string | undefined): Promise<Array<Folder>> {
		const result: Array<Folder> = [];
		const store = this.folderStore;

		async function collect(id?: string): Promise<void> {
			if (!id) {
				return;
			}
			const folder = await store.byId(id);
			if (folder) {
				result.unshift(folder);
				await collect(folder.parentID);
			}
		}

		await collect(folderId);
		return result;
	}

	async getFolderImage(folder: Folder, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (!folder.tag.image) {
			if (!folder.tag.image) {
				return;
			}
		}
		return await this.imageModule.get(folder.id, path.join(folder.path, folder.tag.image), size, format);
	}

	async setFolderImage(folder: Folder, filename: string): Promise<void> {
		const destFileName = FolderTypeImageName[folder.tag.type] + path.extname(filename);
		const destName = path.join(folder.path, destFileName);
		await fileDeleteIfExists(destName);
		await fse.copy(filename, destName);
		folder.tag.image = destFileName;
		await this.folderStore.replace(folder);
	}

	async getArtworkImage(folder: Folder, artwork: Artwork, size?: number, format?: string): Promise<IApiBinaryResult> {
		return await this.imageModule.get(artwork.id, path.join(folder.path, artwork.name), size, format);
	}

	async setCurrentArtworkImage(folder: Folder): Promise<void> {
		if (folder.tag.image) {
			return;
		}
		if (folder.tag.artworks) {
			let artwork: Artwork | undefined;
			if (folder.tag.type === FolderType.artist) {
				artwork = folder.tag.artworks.find(a => a.types.indexOf(ArtworkImageType.artist) >= 0);
			}
			if (!artwork) {
				artwork = folder.tag.artworks.find(a => a.types.indexOf(ArtworkImageType.front) >= 0);
			}
			if (artwork) {
				folder.tag.image = artwork.name;
				await this.folderStore.replace(folder);
			}
		}
	}

	async updateArtworkImage(folder: Folder, artwork: Artwork, name: string): Promise<Artwork> {
		if (containsFolderSystemChars(name)) {
			return Promise.reject(Error('Invalid Image File Name'));
		}
		name = replaceFolderSystemChars(name, '').trim();
		if (name.length === 0) {
			return Promise.reject(Error('Invalid Image File Name'));
		}
		const ext = path.extname(artwork.name).toLowerCase();
		const newName = name + ext;
		await fse.rename(path.join(folder.path, artwork.name), path.join(folder.path, newName));
		await this.imageModule.clearImageCacheByIDs([artwork.id]);
		if (folder.tag.image === artwork.name) {
			folder.tag.image = newName;
		}
		const stat = await fse.stat(path.join(folder.path, newName));
		folder.tag.artworks = (folder.tag.artworks || []).filter(a => a.id !== artwork.id);
		folder.tag.artworks.push({
			id: generateArtworkId(folder.id, newName),
			name: newName,
			types: artWorkImageNameToType(name),
			stat: {
				created: stat.ctime.valueOf(),
				modified: stat.mtime.valueOf(),
				size: stat.size
			}
		});
		await this.folderStore.replace(folder);
		await this.setCurrentArtworkImage(folder);
		return artwork;
	}

	async removeArtworkImage(folder: Folder, artwork: Artwork): Promise<void> {
		if (!folder.tag.artworks) {
			return;
		}
		folder.tag.artworks = (folder.tag.artworks || []).filter(art => art.id !== artwork.id);
		const clearID = [];
		if (folder.tag.image === artwork.name) {
			folder.tag.image = undefined;
			clearID.push(folder.id);
		}
		clearID.push(artwork.id);
		await this.folderStore.replace(folder);
		const destName = path.join(folder.path, artwork.name);
		await fileDeleteIfExists(destName);
		await this.imageModule.clearImageCacheByIDs(clearID);
		await this.setCurrentArtworkImage(folder);
	}

	async downloadFolderArtwork(folder: Folder, imageUrl: string, types: Array<ArtworkImageType>): Promise<Artwork> {
		const name = types.sort((a, b) => a.localeCompare(b)).join('-');
		const filename = await this.imageModule.storeImage(folder.path, name, imageUrl);
		const stat = await fse.stat(path.join(folder.path, filename));
		const artwork: Artwork = {
			id: generateArtworkId(folder.id, filename),
			name: filename,
			types,
			stat: {
				created: stat.ctime.valueOf(),
				modified: stat.mtime.valueOf(),
				size: stat.size
			}
		};
		folder.tag.artworks = folder.tag.artworks || [];
		folder.tag.artworks.push(artwork);
		await this.folderStore.replace(folder);
		await this.setCurrentArtworkImage(folder);
		return artwork;
	}

	async updateFolderParentChange(folder: Folder, destPath: string, parentID: string, rootID: string) {
		folder.path = ensureTrailingPathSeparator(destPath);
		folder.rootID = rootID;
		folder.parentID = parentID;
		await this.folderStore.replace(folder);
		const tracks = await this.trackStore.search({parentID: folder.id});
		for (const track of tracks) {
			track.path = folder.path;
			track.rootID = folder.rootID;
		}
		await this.trackStore.replaceMany(tracks);
		const folders = await this.folderStore.search({parentID: folder.id});
		for (const subfolder of folders) {
			const dest = path.join(destPath, path.basename(subfolder.path));
			await this.updateFolderParentChange(subfolder, dest, folder.id, folder.rootID);
		}
	}

	async moveFolders(folders: Array<Folder>, destFolder: Folder) {
		for (const folder of folders) {
			const dest = path.join(destFolder.path, path.basename(folder.path));
			await fse.move(folder.path, dest);
			await this.updateFolderParentChange(folder, dest, destFolder.id, destFolder.rootID);
		}
	}

}
