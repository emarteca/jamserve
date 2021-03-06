import {DBObject} from '../engine/base/base.model';
import {ListResult} from '../engine/base/list-result';
import {DatabaseQuerySortType} from '../model/jam-types';
import {DBObjectType} from './db.types';

export interface Database {
	open(): Promise<void>;

	drop(): Promise<void>;

	close(): Promise<void>;

	check(): Promise<void>;

	reset(): Promise<void>;

	getDBIndex<T extends DBObject>(type?: DBObjectType): DatabaseIndex<T>;
}

export interface DatabaseIndex<T extends DBObject> {
	type: DBObjectType;

	getNewId(): Promise<string>;

	add(body: T): Promise<string>;

	bulk(bodies: Array<T>): Promise<void>;

	replace(id: string, body: T): Promise<void>;

	remove(id: string | Array<string>): Promise<number>;

	removeByQuery(query: DatabaseQuery): Promise<number>;

	upsert(id: string, body: T): Promise<void>;

	byId(id: string): Promise<T | undefined>;

	byIds(ids: Array<string>): Promise<Array<T>>;

	query(query: DatabaseQuery): Promise<ListResult<T>>;

	queryOne(query: DatabaseQuery): Promise<T | undefined>;

	queryIds(query: DatabaseQuery): Promise<Array<string>>;

	iterate(query: DatabaseQuery, onItems: (items: Array<T>) => Promise<void>): Promise<void>;

	count(query: DatabaseQuery): Promise<number>;

	aggregate(query: DatabaseQuery, field: string): Promise<number>;

	distinct(query: DatabaseQuery, field: string): Promise<Array<string>>;

}

export interface DatabaseQuery {
	all?: boolean;
	term?: {
		[name: string]: string | number | boolean;
	};
	match?: {
		[name: string]: string;
	};
	terms?: {
		[name: string]: Array<string | number | boolean>;
	};
	startsWith?: {
		[name: string]: string;
	};
	startsWiths?: {
		[name: string]: Array<string>;
	};
	range?: {
		[name: string]: { lte?: number; gte?: number };
	};
	notNull?: Array<string>;
	sort?: DatabaseQuerySort;
	amount?: number;
	offset?: number;
}

export interface DatabaseQuerySort {
	[name: string]: DatabaseQuerySortType;
}
