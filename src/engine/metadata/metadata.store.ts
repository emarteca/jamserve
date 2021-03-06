import {Database, DatabaseQuery} from '../../db/db.model';
import {DBObjectType} from '../../db/db.types';
import {QueryHelper} from '../base/base.query.helper';
import {BaseStore, SearchQuery} from '../base/base.store';
import {MetaData} from './metadata.model';
import {MetaDataType} from './metadata.types';

export interface SearchQueryMetaData extends SearchQuery {
	name?: string;
	dataType?: MetaDataType;
	olderThan?: number;
}

export class MetaDataStore extends BaseStore<MetaData, SearchQueryMetaData> {

	constructor(db: Database) {
		super(DBObjectType.metadata, db);
	}

	protected transformQuery(query: SearchQueryMetaData): DatabaseQuery {
		const q = new QueryHelper();
		q.term('name', query.name);
		q.term('dataType', query.dataType);
		q.range('date', query.olderThan, undefined);
		return q.get(query);
	}

}
