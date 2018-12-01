import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {EpisodeStore, SearchQueryEpisode} from './episode.store';
import {Episode} from './episode.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';

function mockEpisode(): Episode {
	return {
		id: '',
		type: DBObjectType.episode,
		podcastID: 'podcastID1',
		status: 'new',
		error: 'an error',
		path: '/tmp/jam/podcasts/podcastID1.mp3',
		link: 'https://example.org/podcastID1/episodeID',
		summary: 'a episode summary',
		date: 1543495268,
		name: 'a name',
		guid: 'a GUID',
		author: 'an author name',
		chapters: [{
			start: 0,
			title: 'a chapter title 1'
		}, {
			start: 2000,
			title: 'a chapter title 2'
		}],
		enclosures: [],
		stat: {
			created: 1543495268,
			modified: 1543495268,
			size: 9001
		},
		tag: {
			album: 'an album name',
			albumSort: 'album sort name, an',
			albumArtist: 'an album artist name',
			albumArtistSort: 'album artist sort name, an',
			artist: 'an artist name',
			artistSort: 'artist sort name, an',
			genre: 'a genre name',
			disc: 3,
			title: 'a title',
			titleSort: 'title sort, a',
			track: 3,
			year: 1984,
			mbTrackID: 'mbTrackID1',
			mbAlbumType: 'mbAlbumType1',
			mbAlbumArtistID: 'mbAlbumArtistID1',
			mbArtistID: 'mbArtistID1',
			mbAlbumID: 'mbAlbumID1',
			mbReleaseTrackID: 'mbReleaseTrackID1',
			mbReleaseGroupID: 'mbReleaseGroupID1',
			mbRecordingID: 'mbRecordingID1',
			mbAlbumStatus: 'mbAlbumStatus1',
			mbReleaseCountry: 'mbReleaseCountry1'
		},
		media: {
			duration: 12345,
			bitRate: 56000,
			format: 'mp3',
			sampleRate: 44000,
			channels: 2,
			encoded: 'VBR',
			mode: 'joint',
			version: 'MPEG 1 Layer 3'
		}
	};
}

function mockEpisode2(): Episode {
	return {
		id: '',
		type: DBObjectType.episode,
		podcastID: 'podcastID2',
		status: 'completed',
		error: 'second error',
		path: '/tmp/jam/podcasts/podcastID1.mp3',
		link: 'https://example.org/podcastID1/episodeID',
		summary: 'second episode summary',
		date: 1543495268,
		name: 'second name',
		guid: 'second GUID',
		author: 'second author name',
		chapters: [{
			start: 10,
			title: 'another chapter title 1'
		}, {
			start: 3000,
			title: 'another chapter title 2'
		}],
		enclosures: [],
		stat: {
			created: 1443495268,
			modified: 1443495268,
			size: 1001
		},
		tag: {
			album: 'second album name',
			albumSort: 'album sort name, second',
			albumArtist: 'second album artist name',
			albumArtistSort: 'album artist sort name, second',
			artist: 'second artist name',
			artistSort: 'artist sort name, second',
			genre: 'second genre name',
			disc: 5,
			title: 'second title',
			titleSort: 'title sort, second',
			track: 5,
			year: 2000,
			mbTrackID: 'mbTrackID2',
			mbAlbumType: 'mbAlbumType2',
			mbAlbumArtistID: 'mbAlbumArtistID2',
			mbArtistID: 'mbArtistID2',
			mbAlbumID: 'mbAlbumID2',
			mbReleaseTrackID: 'mbReleaseTrackID2',
			mbReleaseGroupID: 'mbReleaseGroupID2',
			mbRecordingID: 'mbRecordingID2',
			mbAlbumStatus: 'mbAlbumStatus2',
			mbReleaseCountry: 'mbReleaseCountry2'
		},
		media: {
			duration: 55555,
			bitRate: 128000,
			format: 'mp3',
			sampleRate: 22000,
			channels: 1,
			encoded: 'CBR',
			mode: 'single',
			version: 'MPEG 1 Layer 8'
		}
	};
}

describe('EpisodeStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let episodeStore: EpisodeStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					episodeStore = new EpisodeStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = episodeStore;
				this.generateMockObjects = () => {
					return [mockEpisode(), mockEpisode2()];
				};
				this.generateMatchingQueries = (mock: Episode) => {
					const matches: Array<SearchQueryEpisode> = [
						{id: mock.id},
						{ids: [mock.id]},
						{podcastID: mock.podcastID},
						{podcastIDs: [mock.podcastID]},
						{name: mock.name},
						{status: mock.status},
						{newerThan: mock.date - 1},
						{query: mock.name[0]}
					];
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});