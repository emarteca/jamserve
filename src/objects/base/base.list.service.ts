import {BaseStore, SearchQuery} from './base.store';
import {User} from '../user/user.model';
import {DBObject} from './base.model';
import {StateService} from '../state/state.service';
import {BaseStoreService} from './base.service';

export class BaseListService<T extends DBObject, Q extends SearchQuery> extends BaseStoreService<T, Q> {

	constructor(
		store: BaseStore<T, Q>,
		public stateService: StateService
	) {
		super(store);
	}

	async getFilteredIDs(ids: Array<string>, query: Q): Promise<Array<string>> {
		const list = await this.store.searchIDs(Object.assign(query, {ids, amount: -1, offset: 0}));
		return list.sort((a, b) => {
			return ids.indexOf(a) - ids.indexOf(b);
		});
	}

	async getAvgHighestIDs(query: Q): Promise<Array<string>> {
		const ids = await this.stateService.getAvgHighestDestIDs(this.store.type);
		return await this.getFilteredIDs(ids, query);
	}

	async getHighestRatedIDs(query: Q, user: User): Promise<Array<string>> {
		const ids = await this.stateService.getHighestRatedDestIDs(this.store.type, user.id);
		return await this.getFilteredIDs(ids, query);
	}

	async getFrequentlyPlayedIDs(query: Q, user: User): Promise<Array<string>> {
		const ids = await this.stateService.getFrequentlyPlayedDestIDs(this.store.type, user.id);
		return await this.getFilteredIDs(ids, query);
	}

	async getFavedIDs(query: Q, user: User): Promise<Array<string>> {
		const ids = await this.stateService.getFavedDestIDs(this.store.type, user.id);
		return await this.getFilteredIDs(ids, query);
	}

	async getRecentlyPlayedIDs(query: Q, user: User): Promise<Array<string>> {
		const ids = await this.stateService.getRecentlyPlayedDestIDs(this.store.type, user.id);
		return await this.getFilteredIDs(ids, query);
	}

}