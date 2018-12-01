import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {TrackStore, SearchQueryTrack} from './track.store';
import {Track} from './track.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import path from 'path';
import {TestDBs} from '../../db/db.test';

function mockTrack(): Track {
	return {
		id: '',
		type: DBObjectType.track,
		rootID: 'rootID1',
		parentID: 'folderID1',
		albumID: 'albumID1',
		artistID: 'artistID1',
		name: 'a folder name',
		path: '/var/media/root name/folder name',
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

function mockTrack2(): Track {
	return {
		id: '',
		type: DBObjectType.track,
		rootID: 'rootID2',
		parentID: 'folderID2',
		albumID: 'albumID2',
		artistID: 'artistID2',
		name: 'second folder name',
		path: '/var/media/root name/second folder name',
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
			duration: 54321,
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

describe('TrackStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let trackStore: TrackStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					trackStore = new TrackStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = trackStore;
				this.generateMockObjects = () => {
					return [mockTrack(), mockTrack2()];
				};
				this.generateMatchingQueries = (mock: Track) => {
					const matches: Array<SearchQueryTrack> = [
						{id: mock.id},
						{ids: [mock.id]},
						{path: mock.path},
						{inPath: path.dirname(mock.path)},
						{inPaths: [path.dirname(mock.path)]},
						{artist: mock.tag.artist},
						{artistID: mock.artistID},
						{parentID: mock.parentID},
						{parentIDs: [mock.parentID]},
						{mbTrackID: mock.tag.mbTrackID},
						{mbTrackIDs: [mock.tag.mbTrackID || '']},
						{rootID: mock.rootID},
						{title: mock.tag.title},
						{album: mock.tag.album},
						{genre: mock.tag.genre},
						{fromYear: mock.tag.year, toYear: mock.tag.year},
						{newerThan: mock.stat.created - 1},
						{query: (mock.tag.title || '')[0]}
					];
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});