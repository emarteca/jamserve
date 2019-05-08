import {expect, should} from 'chai';
import fse from 'fs-extra';
import {describe, it} from 'mocha';
import path from 'path';
import {FolderTypesAlbum} from '../../model/jam-types';
import {mockImage} from '../../modules/image/image.module.spec';
import {testService} from '../base/base.service.spec';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';
import {AlbumService} from './album.service';

describe('AlbumService', () => {
	let albumService: AlbumService;
	let folderService: FolderService;
	let trackStore: TrackStore;
	testService({mockData: true},
		async (store, imageModuleTest) => {
			trackStore = store.trackStore;
			const stateService = new StateService(store.stateStore);
			folderService = new FolderService(store.folderStore, store.trackStore, stateService, imageModuleTest.imageModule);
			albumService = new AlbumService(store.albumStore, store.trackStore, folderService, stateService);
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
				const album = await albumService.albumStore.random();
				should().exist(album, 'Wrong Test Setup');
				if (!album) {
					return;
				}
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
					await fse.unlink(filename);
				}
			});
		}
	);
});