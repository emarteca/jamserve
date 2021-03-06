import {testStore} from '../base/base.store.spec';
import {mockState, mockState2} from './state.mock';
import {State} from './state.model';
import {SearchQueryState, StateStore} from './state.store';

describe('StateStore', () => {
	let stateStore: StateStore;

	testStore(testDB => {
			stateStore = new StateStore(testDB.database);
			return stateStore;
		}, () => {
			return [mockState(), mockState2()];
		},
		(mock: State) => {
			const matches: Array<SearchQueryState> = [
				{destID: mock.destID},
				{destIDs: [mock.destID]},
				{userID: mock.userID},
				{type: mock.destType},
				{isPlayed: mock.played > 0},
				{isFaved: mock.faved ? mock.faved > 0 : false},
				{minRating: mock.rated ? mock.rated - 1 : 0},
				{maxRating: mock.rated ? mock.rated + 1 : 5}
			];
			return matches;
		}, () => {
			// nope
		});
});
