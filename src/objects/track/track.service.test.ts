import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {TrackService} from './track.service';
import {FolderService} from '../folder/folder.service';
import {FolderTypesAlbum} from '../../types';
import {mockImage} from '../../engine/image/image.module.spec';
import path from 'path';
import fse from 'fs-extra';

describe('TrackService', () => {
	let trackService: TrackService;
	let folderService: FolderService;
	testService(
		(storeTest, imageModuleTest) => {
			folderService = new FolderService(storeTest.store.folderStore, storeTest.store.trackStore, imageModuleTest.imageModule);
			trackService = new TrackService(storeTest.store.trackStore, folderService);
		},
		() => {
			it('should return the album folder', async () => {
				const tracks = await trackService.trackStore.all();
				expect(tracks.length > 0).to.be.equal(true, 'Wrong Test Setup');
				for (const track of tracks) {
					const folder = await trackService.getTrackFolder(track);
					should().exist(folder);
					if (folder) {
						expect(folder.tag.type).to.be.oneOf(FolderTypesAlbum);
					}
				}
			});
			it('should return a track image', async () => {
				const tracks = await trackService.trackStore.all();
				const track = tracks[0];
				should().exist(track, 'Wrong Test Setup');
				const folder = await trackService.getTrackFolder(track);
				should().exist(folder);
				if (folder) {
					folder.tag.image = 'dummy.png';
					const image = await mockImage('png');
					const filename = path.resolve(folder.path, folder.tag.image);
					await fse.writeFile(filename, image.buffer);
					await folderService.folderStore.replace(folder);
					const img = await trackService.getTrackImage(track);
					should().exist(img, 'Image not found');
					if (img) {
						should().exist(img.file, 'Image response not valid');
						if (img.file) {
							expect(img.file.filename).to.be.equal(filename);
						}
					}
				}
			});
		},
		async () => {
		}
	);
});