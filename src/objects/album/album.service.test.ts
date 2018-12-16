import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {AlbumService} from './album.service';
import {FolderService} from '../folder/folder.service';
import {testService} from '../base/base.service.spec';
import {TrackStore} from '../track/track.store';
import {FolderTypesAlbum} from '../../types';
import fse from 'fs-extra';
import path from 'path';
import {mockImage} from '../../engine/image/image.module.spec';

describe('AlbumService', () => {
	let albumService: AlbumService;
	let folderService: FolderService;
	let trackStore: TrackStore;
	testService(
		(storeTest, imageModuleTest) => {
			trackStore = storeTest.store.trackStore;
			folderService = new FolderService(storeTest.store.folderStore, storeTest.store.trackStore, imageModuleTest.imageModule);
			albumService = new AlbumService(storeTest.store.albumStore, storeTest.store.trackStore, folderService);
		},
		() => {
			it('should return the album folder', async () => {
				const albums = await albumService.albumStore.all();
				expect(albums.length > 0).to.be.equal(true, 'Wrong Test Setup');
				for (const album of albums) {
					const folder = await albumService.getAlbumFolder(album);
					should().exist(folder);
					if (folder) {
						expect(folder.tag.type).to.be.oneOf(FolderTypesAlbum);
					}
				}
			});
			it('should return an album image', async () => {
				const albums = await albumService.albumStore.all();
				const album = albums[0];
				const folder = await albumService.getAlbumFolder(album);
				should().exist(folder);
				if (folder) {
					folder.tag.image = 'dummy.png';
					const image = await mockImage('png');
					const filename = path.resolve(folder.path, folder.tag.image);
					await fse.writeFile(filename, image.buffer);
					await folderService.folderStore.replace(folder);
					const img = await albumService.getAlbumImage(album);
					should().exist(img, 'Image not found');
					if (img) {
						should().exist(img.file, 'Image response not valid');
						if (img.file) {
							expect(img.file.filename).to.be.equal(filename);
						}
					}
				}
			});
		}
	);
});
