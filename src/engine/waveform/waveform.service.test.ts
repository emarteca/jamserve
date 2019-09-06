import {testService} from '../base/base.service.spec';
import {WaveformService} from './waveform.service';
import tmp from 'tmp';
import path from 'path';
import {TrackStore} from '../track/track.store';
import {mockEpisode} from '../episode/episode.mock';

describe('WaveformService', () => {
	let waveformService: WaveformService;
	let dir: tmp.DirResult;
	let trackStore: TrackStore;
	testService({mockData: true},
		async (store, imageModuleTest) => {
			dir = tmp.dirSync();
			waveformService = new WaveformService(dir.name);
			trackStore = store.trackStore;
		},
		() => {
			it('should return svg for a track', async () => {
				const track = await trackStore.random();
				if (!track) {
					throw Error('Wrong Test Setup');
				}
				let result = await waveformService.getTrackWaveform(track, 'svg');
				expect(result).toBeTruthy();
				expect(result.buffer).toBeTruthy();
				if (!result.buffer) {
					return;
				}
				expect(result.buffer.contentType).toBe('image/svg+xml');
				result = await waveformService.getTrackWaveform(track, 'svg');
				expect(result).toBeTruthy();
				expect(result.file).toBeTruthy();
				await waveformService.clearWaveformCacheByIDs([track.id]);
			});
			it('should return svg for an episode', async () => {
				const track = await trackStore.random();
				expect(track).toBeTruthy(); // 'Wrong Test Setup');
				if (!track) {
					return;
				}
				const episode = mockEpisode();
				episode.path = path.resolve(track.path, track.name);
				episode.id = 'testEpisodeID';
				let result = await waveformService.getEpisodeWaveform(episode, 'svg');
				expect(result).toBeTruthy();
				expect(result.buffer).toBeTruthy();
				if (!result.buffer) {
					return;
				}
				expect(result.buffer.contentType).toBe('image/svg+xml');
				result = await waveformService.getEpisodeWaveform(episode, 'svg');
				expect(result).toBeTruthy();
				expect(result.file).toBeTruthy();
				await waveformService.clearWaveformCacheByIDs([episode.id]);
			});
			it('should return json', async () => {
				const track = await trackStore.random();
				expect(track).toBeTruthy(); // 'Wrong Test Setup');
				if (!track) {
					return;
				}
				let result = await waveformService.getTrackWaveform(track, 'json');
				expect(result).toBeTruthy();
				expect(result.json).toBeTruthy();
				if (!result.json) {
					return;
				}
				result = await waveformService.getTrackWaveform(track, 'json');
				expect(result).toBeTruthy();
				expect(result.file).toBeTruthy();
				await waveformService.clearWaveformCacheByIDs([track.id]);
			});
			it('should return binary', async () => {
				const track = await trackStore.random();
				expect(track).toBeTruthy(); // 'Wrong Test Setup');
				if (!track) {
					return;
				}
				let result = await waveformService.getTrackWaveform(track, 'dat');
				expect(result).toBeTruthy();
				expect(result.buffer).toBeTruthy();
				if (!result.buffer) {
					return;
				}
				expect(result.buffer.contentType).toBe('application/binary');
				result = await waveformService.getTrackWaveform(track, 'dat');
				expect(result).toBeTruthy();
				expect(result.file).toBeTruthy();
				await waveformService.clearWaveformCacheByIDs([track.id]);
			});
			it('should throw errors', async () => {
				const track = await trackStore.random();
				expect(track).toBeTruthy(); // 'Wrong Test Setup');
				if (!track) {
					return;
				}
				await expect(waveformService.getTrackWaveform(track, <any>'invalid')).rejects.toThrow('Invalid Format for Waveform generation');
				track.name = 'invalid.invalid.invalid';
				await expect(waveformService.getTrackWaveform(track, 'svg')).rejects.toThrow('Invalid filename for waveform generation');
				const episode = mockEpisode();
				episode.path = undefined;
				episode.id = 'testEpisodeID';
				await expect(waveformService.getEpisodeWaveform(episode, 'svg')).rejects.toThrow('Podcast episode not ready');
			});
			it('should block creating a waveform while creating a waveform', async () => {
				const track = await trackStore.random();
				expect(track).toBeTruthy(); // 'Wrong Test Setup');
				if (!track) {
					return;
				}
				const promise = waveformService.getTrackWaveform(track, 'svg');
				const result = await waveformService.getTrackWaveform(track, 'svg');
				const result2 = await promise;
				expect(result).toBeTruthy();
				expect(result.buffer).toBeTruthy();
				expect(result2).toBeTruthy();
				expect(result2.buffer).toBeTruthy();
				await waveformService.clearWaveformCacheByIDs([track.id]);
			});
		},
		async () => {
			dir.removeCallback();
		}
	);
});
