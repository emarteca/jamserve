import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {ArtistStore, SearchQueryArtist} from './artist.store';
import {TestNeDB} from '../../db/nedb/db-nedb.test';
import {Artist} from './artist.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';
import {AlbumStore, SearchQueryAlbum} from '../album/album.store';
import {Album} from '../album/album.model';

function mockArtist(): Artist {
	return {
		id: '',
		type: DBObjectType.artist,
		name: 'artist name',
		rootIDs: ['rootID1', 'rootID2'],
		trackIDs: ['trackID1', 'trackID2'],
		albumIDs: ['albumID1', 'albumID2'],
		mbArtistID: 'mbArtistID1',
		created: 1543495268
	};
}

function mockArtist2(): Artist {
	return {
		id: '',
		type: DBObjectType.artist,
		name: 'second artist name',
		rootIDs: ['rootID2'],
		trackIDs: ['trackID3', 'trackID4'],
		albumIDs: ['albumID3', 'albumID4'],
		mbArtistID: 'mbArtistID2',
		created: 1443495268
	};
}

describe('ArtistStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let artistStore: ArtistStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					artistStore = new ArtistStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = artistStore;
				this.generateMockObjects = () => {
					return [mockArtist(), mockArtist2()];
				};
				this.generateMatchingQueries = (mock: Artist) => {
					const matches: Array<SearchQueryArtist> = [
						{id: mock.id},
						{ids: [mock.id]},
						{name: mock.name},
						{names: [mock.name]},
						{trackIDs: mock.trackIDs},
						{mbArtistID: mock.mbArtistID},
						{newerThan: mock.created - 1},
						{query: mock.name[0]}
					];
					mock.albumIDs.forEach(albumID => matches.push({albumID}));
					mock.rootIDs.forEach(rootID => matches.push({rootID}));
					mock.trackIDs.forEach(trackID => matches.push({trackID}));
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});
