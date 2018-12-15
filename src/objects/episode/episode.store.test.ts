import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {EpisodeStore, SearchQueryEpisode} from './episode.store';
import {Episode} from './episode.model';
import {testStore} from '../base/base.store.spec';
import {mockEpisode, mockEpisode2} from './episode.mock';

describe('EpisodeStore', () => {
	let episodeStore: EpisodeStore;

	testStore((testDB) => {
		episodeStore = new EpisodeStore(testDB.database);
		return episodeStore;
	}, () => {
		return [mockEpisode(), mockEpisode2()];
	}, (mock: Episode) => {
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
	}, () => {
	});
});