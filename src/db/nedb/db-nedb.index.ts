import Nedb from 'nedb';
import {DBObject} from '../../engine/base/base.model';
import {ListResult} from '../../engine/base/list-result';
import {DatabaseQuerySortType} from '../../model/jam-types';
import {paginate} from '../../utils/paginate';
import {DatabaseIndex, DatabaseQuery} from '../db.model';
import {DBObjectType} from '../db.types';

function regExpEscape(literal: string): string {
	return literal.replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, '\\$&');
}

export class DBIndexNedb<T extends DBObject> implements DatabaseIndex<T> {
	protected _index: string;
	protected _type: string;

	constructor(public type: DBObjectType, public client: Nedb, private getGlobalNewID: () => string) {
		this._type = DBObjectType[type];
		this._index = `jam_${DBObjectType[type]}`;
	}

	private hit2Obj(hit: T): T {
		delete (hit as any)._id;
		return hit;
	}

	private hits2Objs(hits: Array<T>): Array<T> {
		return hits.map(hit => {
			return this.hit2Obj(hit);
		});
	}

	async getNewId(): Promise<string> {
		return this.getGlobalNewID();
	}

	private translateSortQuery(query: DatabaseQuery): { [name: string]: number } | undefined {
		if (query.sort) {
			const result: { [name: string]: number } = {};
			const sort = query.sort;
			Object.keys(sort).forEach(key => {
				result[key] = sort[key] === DatabaseQuerySortType.ascending ? 1 : -1;
			});
			return result;
		}
	}

	private translateQuery(query: DatabaseQuery): any {
		if (query.all) {
			return {};
		}
		let must: Array<any> = [];
		if (query.term) {
			const o = query.term;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					term[key] = o[key];
					return term;
				})
			);
		}
		if (query.match) {
			const o = query.match;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					term[key] = {$regex: new RegExp(regExpEscape(o[key].toString()), 'i')};
					return term;
				})
			);

		}
		if (query.terms) {
			const o = query.terms;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					term[key] = {$in: o[key]};
					return term;
				})
			);
		}
		if (query.startsWith) {
			const o = query.startsWith;
			must = must.concat(
				Object.keys(o).map((key: string): any => {
					return {
						$where(): boolean {
							return this[key].startsWith(o[key]);
						}
					};
				})
			);
		}
		if (query.startsWiths) {
			const o = query.startsWiths;
			must = must.concat(
				Object.keys(o).map((key: string): any => {
					return {
						$where(): boolean {
							return !!o[key].find(entry => this[key].startsWith(entry));
						}
					};
				})
			);
		}
		if (query.range) {
			const o = query.range;
			Object.keys(o).forEach(key => {
				const vals = o[key];
				if (vals.gte !== undefined) {
					const term: any = {};
					term[key] = {$gte: vals.gte};
					must.push(term);
				}
				if (vals.lte !== undefined) {
					const term: any = {};
					term[key] = {$lte: vals.lte};
					must.push(term);
				}
			});
		}
		if (query.notNull) {
			const o = query.notNull;
			must = must.concat(o.map(key => {
				const term: any = {};
				term[key] = {$exists: true};
				return term;
			}));
		}
		return {$and: must};
	}

	async add(body: T): Promise<string> {
		if (!body.id || body.id.length === 0) {
			body.id = await this.getNewId();
		}
		return new Promise<string>((resolve, reject) => {
			this.client.insert(body, err => {
				if (err) {
					reject(err);
				} else {
					resolve(body.id);
				}
			});
		});
	}

	async bulk(bodies: Array<T>): Promise<void> {
		for (const body of bodies) {
			await this.add(body);
		}
	}

	async replace(id: string, body: T): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.client.update({id}, body, {}, (err, numReplaced) => {
				if (err) {
					reject(err);
				} else if (numReplaced !== 1) {
					reject(Error(`Could not find ${this._type} doc with id ${id}`));
				} else {
					resolve();
				}
			});
		});
	}

	async upsert(id: string, body: T): Promise<void> {
		if (!id || id.length === 0) {
			await this.add(body);
			return;
		}
		await this.replace(id, body);
	}

	async remove(id: string | Array<string>): Promise<number> {
		const ids = Array.isArray(id) ? id : [id];
		if (ids.length === 0) {
			return 0;
		}
		return new Promise<number>((resolve, reject) => {
			this.client.remove({id: {$in: ids}}, {multi: true}, (err, count) => {
				if (err) {
					reject(err);
				} else if (count !== ids.length) {
					reject(Error(`Found nr of items ${count} does not match nr. of ids ${ids.length}`));
				} else {
					resolve(count);
				}
			});
		});
	}

	async removeByQuery(query: DatabaseQuery): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.client.remove(this.translateQuery(query), {multi: true}, (err, count) => {
				if (err) {
					reject(err);
				} else {
					resolve(count);
				}
			});
		});
	}

	async byId(id: string): Promise<T | undefined> {
		if (this.type === undefined) {
			return this.queryOne({term: {id}});
		}
		return new Promise<T>((resolve, reject) => {
			this.client.find<T>({id}, (err, docs) => {
				if (err) {
					reject(err);
				} else if (docs.length === 0) {
					resolve();
				} else {
					resolve(this.hit2Obj(docs[0]));
				}
			});
		});
	}

	async byIds(ids: Array<string>): Promise<Array<T>> {
		if (ids.length === 0) {
			return [];
		}
		return new Promise<Array<T>>((resolve, reject) => {
			this.client.find<T>({id: {$in: ids}}, (err, docs) => {
				if (err) {
					reject(err);
				} else {
					resolve(this.hits2Objs(docs));
				}
			});
		});
	}

	async query(query: DatabaseQuery): Promise<ListResult<T>> {
		let dbquery = this.client.find<T>(this.translateQuery(query));
		const sort = this.translateSortQuery(query);
		if (sort) {
			dbquery = dbquery.sort(sort);
		}
		return new Promise<ListResult<T>>((resolve, reject) => {
			dbquery.exec((err, docs) => {
				if (err) {
					reject(err);
				} else {
					const list = paginate(docs, query.amount, query.offset);
					resolve({items: this.hits2Objs(list.items), offset: list.offset, amount: list.amount, total: list.total});
				}
			});
		});
	}

	async queryOne(query: DatabaseQuery): Promise<T | undefined> {
		return new Promise<T>((resolve, reject) => {
			this.client.find<T>(this.translateQuery(query)).limit(1).exec((err, docs) => {
				if (err) {
					reject(err);
				} else if (docs.length === 0) {
					resolve();
				} else {
					resolve(this.hit2Obj(docs[0]));
				}
			});
		});
	}

	private prepareFindCursor(query: DatabaseQuery): Nedb.Cursor<T> {
		let dbquery = this.client.find<T>(this.translateQuery(query));
		const sort = this.translateSortQuery(query);
		if (sort) {
			dbquery = dbquery.sort(sort);
		}
		if (query.offset) {
			dbquery = dbquery.skip(query.offset);
		}
		if (query.amount) {
			dbquery = dbquery.limit(query.amount);
		}
		return dbquery;
	}

	async iterate(query: DatabaseQuery, onItems: (items: Array<T>) => Promise<void>): Promise<void> {
		const dbquery = this.prepareFindCursor(query);
		return new Promise<void>((resolve, reject) => {
			dbquery.exec((err, docs) => {
				if (err) {
					reject(err);
				} else {
					onItems(this.hits2Objs(docs)).then(resolve).catch(reject);
				}
			});
		});
	}

	async queryIds(query: DatabaseQuery): Promise<Array<string>> {
		const dbquery = this.prepareFindCursor(query);
		return new Promise<Array<string>>((resolve, reject) => {
			dbquery.exec((err, docs) => {
				if (err) {
					reject(err);
				} else {
					resolve(docs.map(o => o.id));
				}
			});
		});
	}

	private getDotFieldValues(field: string, o: T): Array<string> {
		const result: Array<any> = [];

		const getFieldValueR = (fields: Array<string>, obj: any): void => {
			const sub = obj[fields[0]];
			if (sub === undefined) {
				return;
			}
			if (Array.isArray(sub)) {
				if (fields.length === 1) {
					return;
				}
				sub.forEach(child => {
					getFieldValueR(fields.slice(1), child);
				});
			} else {
				if (fields.length === 1) {
					result.push(sub.toString());
				} else if (typeof sub === 'object') {
					getFieldValueR(fields.slice(1), sub);
				}
			}
		};

		getFieldValueR(field.split('.'), o);
		return result;
	}

	private collectDistinctValues(field: string, docs: Array<T>): Array<string> {
		const list: Array<string> = [];
		docs.forEach(doc => {
			const vals = this.getDotFieldValues(field, doc);
			vals.forEach(val => {
				if (!list.includes(val)) {
					list.push(val);
				}
			});
		});
		return list;
	}

	async aggregate(query: DatabaseQuery, field: string): Promise<number> {
		const dbquery = this.prepareFindCursor(query);
		return new Promise<number>((resolve, reject) => {
			dbquery.exec((err, docs) => {
				if (err) {
					reject(err);
				} else {
					resolve(this.collectDistinctValues(field, docs).length);
				}
			});
		});
	}

	async count(query: DatabaseQuery): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.client.count(this.translateQuery(query), (err, count) => {
				if (err) {
					reject(err);
				} else {
					resolve(count);
				}
			});
		});
	}

	async distinct(query: DatabaseQuery, field: string): Promise<Array<string>> {
		return new Promise<Array<string>>((resolve, reject) => {
			this.client.find<T>(this.translateQuery(query), (err, docs) => {
				if (err) {
					reject(err);
				} else {
					resolve(this.collectDistinctValues(field, docs));
				}
			});
		});
	}

}
