import {ApiResponse, RequestParams} from '@elastic/elasticsearch';
import {DBObject} from '../../engine/base/base.model';
import {ListResult} from '../../engine/base/list-result';
import {DatabaseIndex, DatabaseQuery} from '../db.model';
import {DBObjectType} from '../db.types';
import {DBElastic} from './db-elastic';
import {mapping} from './db-elastic.mapping';
import {DeleteByQueryResponse, GetResponse, Hit, MgetResponse, SearchResponse} from './db-elastic.types';

export class DBIndexElastic<T extends DBObject> implements DatabaseIndex<T> {
	protected _index: string;
	protected _type: string;
	protected _map: any;
	public type: DBObjectType;
	public db: DBElastic;

	constructor(type: DBObjectType, db: DBElastic) {
		this.type = type;
		if (type === undefined) {
			this._index = db.indexName('*'); // 'all';
			this._type = '';
		} else {
			this._type = DBObjectType[type];
			this._index = db.indexName(DBObjectType[type]);
		}
		this._map = mapping[this._type];
		this.db = db;
	}

	private hit2Obj(hit: Hit<any>): T {
		hit._source.id = hit._source.id.toString();
		hit._source.type = this.type;
		return hit._source as T;
	}

	private filterProperties(o: T): any {
		return {...o, type: undefined};
	}

	private getPropertyMapping(key: string): any {
		const parts = key.split('.');
		let o = this._map;
		for (const p of parts) {
			o = o.properties[p];
		}
		return o;
	}

	private translateElasticQuery(query: DatabaseQuery): any {
		if (query.all) {
			return {match_all: {}};
		}
		let must: Array<any> = [];
		if (query.term) {
			const o = query.term;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					const prop = this.getPropertyMapping(key);
					if (!prop) {
						console.log('Unknown prop', this._type, key);
					}
					if (prop && prop.type === 'text') {
						term[`${key}.keyword`] = o[key];
					} else {
						term[key] = o[key];
					}
					return {term};
				})
			);
		}
		if (query.terms) {
			const o = query.terms;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					const prop = this.getPropertyMapping(key);
					if (!prop) {
						console.log('Unknown prop', this._type, key);
					}
					if (prop && prop.type === 'text') {
						term[`${key}.keyword`] = o[key];
					} else {
						term[key] = o[key];
					}
					return {terms: term};
				})
			);
		}
		if (query.match) {
			const o = query.match;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					term[key] = o[key];
					return {match_phrase_prefix: term};
				})
			);
		}
		if (query.startsWith) {
			const o = query.startsWith;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					term[key] = o[key];
					return {prefix: term};
				})
			);
		}
		if (query.startsWiths) {
			const o = query.startsWiths;
			Object.keys(o).forEach(key => {
				o[key].forEach(s => {
					const term: any = {};
					term[key] = s;
					must.push({prefix: term});
				});
			});
		}
		if (query.range) {
			const o = query.range;
			must = must.concat(
				Object.keys(o).map(key => {
					const vals = o[key];
					const term: any = {};
					term[key] = {gte: vals.gte, lte: vals.lte};
					return {range: term};
				})
			);
		}
		if (query.notNull) {
			const o = query.notNull;
			must = must.concat(o.map(key => {
				return {exists: {field: key}};
			}));
		}
		return {
			bool: {
				must
			}
		};
	}

	private async scroll(response: SearchResponse<T>, onHits: (hits: Array<any>) => Promise<void>): Promise<void> {
		let count = 0;

		const getMoreUntilDone = async (res: SearchResponse<T>): Promise<void> => {
			count += res.hits.hits.length;
			await onHits(res.hits.hits);
			if (res.hits.total !== count && res._scroll_id) {
				// now we can call scroll over and over
				const next: ApiResponse<SearchResponse<T>> = await this.db.client.scroll({scroll_id: res._scroll_id, scroll: '30s'});
				await getMoreUntilDone(next.body);
			}
		};

		await getMoreUntilDone(response);
	}

	private async indexItem(body: T, id: string): Promise<void> {
		await this.db.client.index({
			index: this._index,
			type: this._type,
			body: this.filterProperties(body),
			id,
			refresh: this.db.indexRefresh
		});
	}

	private async search(query: DatabaseQuery, params: RequestParams.Search): Promise<SearchResponse<T>> {
		params.body = {...(params.body || {}), query: this.translateElasticQuery(query)};
		const res: ApiResponse<SearchResponse<T>> = await this.db.client.search({...params, index: this._index, type: this._type});
		return res.body;
	}

	async add(body: T): Promise<string> {
		if (!body.id || body.id.length === 0) {
			body.id = await this.getNewId();
		}
		await this.indexItem(body, body.id);
		return body.id;
	}

	async aggregate(query: DatabaseQuery, field: string): Promise<number> {
		const response = await this.search(query, {body: {aggs: {_count: {cardinality: {field}}}}});
		return response.aggregations._count.value;
	}

	async bulk(bodies: Array<T>): Promise<void> {
		for (const body of bodies) {
			await this.add(body);
		}
	}

	async byId(id: string): Promise<T | undefined> {
		if (this.type === undefined) {
			return this.queryOne({term: {id}});
		}
		try {
			const response: ApiResponse<GetResponse<T>> = await this.db.client.get({
				index: this._index,
				type: this._type,
				id
			});
			if (!response.body.found) {
				return;
			}
			return this.hit2Obj(response.body);
		} catch (e) {
			if (e.statusCode !== 404) {
				return Promise.reject(e);
			}
		}
	}

	async byIds(ids: Array<string>): Promise<Array<T>> {
		if (ids.length === 0) {
			return [];
		}
		const response: ApiResponse<MgetResponse<T>> = await this.db.client.mget({
			index: this._index,
			type: this._type,
			body: {ids}
		});
		if (!response.body.docs) {
			return [];
		}
		return response.body.docs
			.filter(doc => doc.found)
			.map(doc => this.hit2Obj(doc));
	}

	async count(query: DatabaseQuery): Promise<number> {
		const response = await this.search(query, {size: 0});
		return response.hits.total;
	}

	async distinct(query: DatabaseQuery, field: string): Promise<Array<string>> {
		const response = await this.search(query, {body: {aggs: {distinct: {terms: {field}}}}});
		return response.aggregations.distinct.buckets.map((hit: any) => hit.key);
	}

	async getNewId(): Promise<string> {
		return this.db.getNewId();
	}

	async query(query: DatabaseQuery): Promise<ListResult<T>> {
		if (query.amount && query.offset) {
			const response = await this.search(query, {from: query.offset, size: query.amount});
			return {
				amount: query.amount,
				offset: query.offset,
				total: response.hits.total,
				items: response.hits.hits.map(o => this.hit2Obj(o))
			};
		}
		return this.queryScroll(query);
	}

	private async queryScroll(query: DatabaseQuery): Promise<ListResult<T>> {
		let docs: Array<Hit<T>> = [];
		const response = await this.search(query, {scroll: '30s', size: 100});
		await this.scroll(response, async hits => {
			docs = docs.concat(hits);
		});
		return {
			total: docs.length,
			items: docs.map(o => this.hit2Obj(o))
		};
	}

	async queryOne(query: DatabaseQuery): Promise<T | undefined> {
		const response = await this.search(query, {size: 1});
		if (response.hits.total > 0) {
			return this.hit2Obj(response.hits.hits[0]);
		}
		return;
	}

	async queryIds(query: DatabaseQuery): Promise<Array<string>> {
		let list: Array<string> = [];
		const response = await this.search(query, {scroll: '30s', body: {stored_fields: []}});
		await this.scroll(response, async hits => {
			list = list.concat(hits.map(hit => hit._id.toString()));
		});
		return list;
	}

	async iterate(query: DatabaseQuery, onItem: (items: Array<T>) => Promise<void>): Promise<void> {
		const response = await this.search(query, {scroll: '30s', size: 100});
		await this.scroll(response, async hits => {
			await onItem(hits.map(o => this.hit2Obj(o)));
		});
	}

	async remove(id: string | Array<string>): Promise<number> {
		if (id.length === 0) {
			return Promise.resolve(0);
		}
		if (Array.isArray(id)) {
			const response: ApiResponse<DeleteByQueryResponse> = await this.db.client.deleteByQuery({
				index: this._index,
				type: this._type,
				body: {query: {terms: {_id: id}}},
				refresh: !this.db.indexRefresh || this.db.indexRefresh !== 'false'
			});
			return response.body.deleted;
		}
		await this.db.client.delete({
			id, index: this._index, type: this._type,
			refresh: this.db.indexRefresh
		});
		return 1;
	}

	async removeByQuery(query: DatabaseQuery): Promise<number> {
		const response: ApiResponse<DeleteByQueryResponse> = await this.db.client.deleteByQuery({
			index: this._index,
			type: this._type,
			body: {
				query: this.translateElasticQuery(query)
			},
			refresh: !this.db.indexRefresh || this.db.indexRefresh !== 'false'
		});
		return response.body.deleted;
	}

	async replace(id: string, body: T): Promise<void> {
		await this.indexItem(body, id);
	}

	async upsert(id: string, body: T): Promise<void> {
		if (!id || id.length === 0) {
			await this.add(body);
			return;
		}
		await this.indexItem(body, id);
	}

}
