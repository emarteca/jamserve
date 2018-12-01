import {DBObjectType} from '../../types';
import {BaseStore, SearchQuery} from '../base/base.store';
import {QueryHelper} from '../base/base.store';
import {User} from './user.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryUser extends SearchQuery {
	name?: string;
	isAdmin?: boolean;
}

export class UserStore extends BaseStore<User, SearchQueryUser> {

	constructor(db: Database) {
		super(DBObjectType.user, db);
	}

	protected transformQuery(query: SearchQueryUser): DatabaseQuery {
		const q = new QueryHelper();
		q.term('name', query.name);
		q.bool('roles.adminRole', query.isAdmin);
		q.match('name', query.query);
		return q.get(query);
	}

}