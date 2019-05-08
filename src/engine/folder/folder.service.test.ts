import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {FolderService} from './folder.service';
import nock from 'nock';
import path from 'path';
import tmp from 'tmp';
import fse from 'fs-extra';
import {SupportedWriteImageFormat} from '../../utils/filetype';
import mimeTypes from 'mime-types';
import {ArtworkImageType, FolderType} from '../../model/jam-types';
import {testService} from '../base/base.service.spec';
import {ImageModuleTest, mockImage} from '../../modules/image/image.module.spec';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';

describe('FolderService', () => {
	let trackStore: TrackStore;
	let folderService: FolderService;
	let imageModuleTest: ImageModuleTest;
	testService({mockData: true},
		async (store, imageModuleTestPara) => {
			imageModuleTest = imageModuleTestPara;
			trackStore = store.trackStore;
			const stateService = new StateService(store.stateStore);
			folderService = new FolderService(store.folderStore, store.trackStore, stateService, imageModuleTest.imageModule);
		},
		() => {
			describe('setFolderImage', () => {
				it('should do handle invalid parameters', async () => {
					const folder = await folderService.folderStore.random();
					should().exist(folder, 'Wrong Test Setup');
					if (!folder) {
						return;
					}
					await folderService.setFolderImage(folder, 'invalid-not-existent').should.eventually.be.rejectedWith(Error);
					await folderService.setFolderImage(folder, '').should.eventually.be.rejectedWith(Error);
				});
				it('should set an image', async () => {
					const folder = await folderService.folderStore.random();
					should().exist(folder, 'Wrong Test Setup');
					if (!folder) {
						return;
					}
					folder.tag.image = undefined;
					const file = tmp.fileSync();
					await folderService.setFolderImage(folder, file.name);
					should().exist(folder.tag.image);
					const image = path.resolve(folder.path, folder.tag.image || 'invalid-not-existent');
					expect(await fse.pathExists(image)).to.equal(true, 'folder image file does not exist ' + image);
					file.removeCallback();
					await fse.unlink(image);
					const updatedFolder = await folderService.folderStore.byId(folder.id);
					should().exist(updatedFolder);
					if (!updatedFolder) {
						return;
					}
					expect(updatedFolder.tag.image).to.equal(folder.tag.image);
					folder.tag.image = undefined;
					await folderService.folderStore.upsert([folder]);
				});
			});

			describe('downloadFolderImage', () => {
				it('should do handle invalid parameters', async () => {
					const folder = await folderService.folderStore.random();
					should().exist(folder, 'Wrong Test Setup');
					if (!folder) {
						return;
					}
					// await folderService.downloadFolderArtwork(folder, 'invalid', [ArtworkImageType.front]).should.eventually.be.rejectedWith(Error);
					// await folderService.downloadFolderArtwork(folder, 'http://invaliddomain.invaliddomain.invaliddomain/invalid', [ArtworkImageType.front]).should.eventually.be.rejectedWith(Error);
					const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
						.get('/invalid.png').reply(404);
					await folderService.downloadFolderArtwork(folder, 'http://invaliddomain.invaliddomain.invaliddomain/invalid.png', [ArtworkImageType.front]).should.eventually.be.rejectedWith(Error);
					expect(scope.isDone()).to.equal(true, 'no request has been made');
				});
				it('should download an image', async () => {
					const folder = await folderService.folderStore.random();
					should().exist(folder, 'Wrong Test Setup');
					if (!folder) {
						return;
					}
					const image = await mockImage('png');
					const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
						.get('/image.png').reply(200, image.buffer, {'Content-Type': image.mime});
					const artwork = await folderService.downloadFolderArtwork(folder, 'http://invaliddomain.invaliddomain.invaliddomain/image.png', [ArtworkImageType.front]);
					expect(scope.isDone()).to.equal(true, 'no request has been made');
					const filename = path.resolve(folder.path, folder.tag.image || 'invalid-not-existent');
					expect(await fse.pathExists(filename)).to.equal(true, 'folder image file does not exist ' + filename);
					await fse.unlink(filename);
					const updatedFolder = await folderService.folderStore.byId(folder.id);
					should().exist(updatedFolder);
					if (!updatedFolder) {
						return;
					}
					expect(updatedFolder.tag.image).to.equal(folder.tag.image);
				});
			});

			describe('getFolderImage', () => {
				it('should return an empty response for not available images', async () => {
					const folder = await folderService.folderStore.random();
					should().exist(folder, 'Wrong Test Setup');
					if (!folder) {
						return;
					}
					folder.tag.image = undefined;
					const res = await folderService.getFolderImage(folder);
					should().not.exist(res);
				});
				it('should deliver local images', async () => {
					const folder = await folderService.folderStore.random();
					should().exist(folder, 'Wrong Test Setup');
					if (!folder) {
						return;
					}
					const image = await mockImage('png');
					const filename = path.resolve(folder.path, 'dummy.png');
					await fse.writeFile(filename, image.buffer);
					folder.tag.image = 'dummy.png';
					let res = await folderService.getFolderImage(folder);
					should().exist(res);
					if (res) {
						should().exist(res.file);
						if (res.file) {
							expect(res.file.filename).to.equal(filename);
						}
					}
					res = await folderService.getFolderImage(folder, 100);
					should().exist(res);
					if (res) {
						should().exist(res.buffer);
					}
					for (const format of SupportedWriteImageFormat) {
						res = await folderService.getFolderImage(folder, 100, format);
						should().exist(res, 'image format ' + format + ' did not work');
						if (res) {
							expect(!!res.buffer || !!res.file).to.equal(true);
							if (res.buffer) {
								const mime = mimeTypes.lookup(format);
								expect(res.buffer.contentType).to.equal(mime);
							}
							if (res.file) {
								expect(path.extname(res.file.filename)).to.equal('.' + format);
								expect(path.extname(res.file.name)).to.equal('.' + format);
							}
						}
					}
					await fse.unlink(filename);
					await imageModuleTest.imageModule.clearImageCacheByID(folder.id);
				});

			});

			describe('collectFolderPath', () => {
				it('should do handle invalid parameters', async () => {
					let list = await folderService.collectFolderPath(undefined);
					expect(list.length).to.equal(0);
					list = await folderService.collectFolderPath('invalid');
					expect(list.length).to.equal(0);
				});
				it('should report the right parents', async () => {
					const folders = await folderService.folderStore.all();
					for (const f of folders) {
						const list = await folderService.collectFolderPath(f.id);
						expect(list.length).to.equal(f.tag.level + 1);
						list.forEach((item, index) => {
							expect(f.path.indexOf(item.path)).to.equal(0);
							expect(item.tag.level).to.equal(index);
						});
					}
				});

			});

		});
});