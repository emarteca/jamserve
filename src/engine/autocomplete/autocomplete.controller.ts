import {JamRequest} from '../../api/jam/api';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {Store} from '../store/store';

export class AutocompleteController {

	constructor(private store: Store) {

	}

	async autocomplete(req: JamRequest<JamParameters.AutoComplete>): Promise<Jam.AutoComplete> {
		return this.autocompleteQuery(req.query);
	}

	async autocompleteQuery(query: JamParameters.AutoComplete): Promise<Jam.AutoComplete> {
		const result: Jam.AutoComplete = {};
		if (query.track !== undefined && query.track > 0) {
			const list = await this.store.trackStore.search({query: query.query, amount: query.track});
			result.tracks = list.items.map(o => {
				return {id: o.id, name: o.tag.title || ''};
			});
		}
		if (query.album !== undefined && query.album > 0) {
			const list = await this.store.albumStore.search({query: query.query, amount: query.album});
			result.albums = list.items.map(o => {
				return {id: o.id, name: o.name};
			});
		}
		if (query.artist !== undefined && query.artist > 0) {
			const list = await this.store.artistStore.search({query: query.query, amount: query.artist});
			result.artists = list.items.map(o => {
				return {id: o.id, name: o.name};
			});
		}
		if (query.folder !== undefined && query.folder > 0) {
			const list = await this.store.artistStore.search({query: query.query, amount: query.folder});
			result.folders = list.items.map(o => {
				return {id: o.id, name: o.name};
			});
		}
		if (query.playlist !== undefined && query.playlist > 0) {
			const list = await this.store.playlistStore.search({query: query.query, amount: query.playlist});
			result.playlists = list.items.map(o => {
				return {id: o.id, name: o.name};
			});
		}
		if (query.podcast !== undefined && query.podcast > 0) {
			const list = await this.store.podcastStore.search({query: query.query, amount: query.podcast});
			result.podcasts = list.items.map(o => {
				return {id: o.id, name: o.tag ? o.tag.title : ''};
			});
		}
		if (query.episode !== undefined && query.episode > 0) {
			const list = await this.store.episodeStore.search({query: query.query, amount: query.episode});
			result.episodes = list.items.map(o => {
				return {id: o.id, name: o.name};
			});
		}
		if (query.series !== undefined && query.series > 0) {
			const list = await this.store.seriesStore.search({query: query.query, amount: query.series});
			result.series = list.items.map(o => {
				return {id: o.id, name: o.name};
			});
		}
		return result;
	}
}
