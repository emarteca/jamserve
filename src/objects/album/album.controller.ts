import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType} from '../../types';
import {paginate} from '../../utils/paginate';
import {JamRequest} from '../../api/jam/api';
import {BaseListController} from '../base/base.list.controller';
import {TrackController, defaultTrackSort} from '../track/track.controller';
import {formatAlbum, formatAlbumInfo} from './album.format';
import {AlbumStore, SearchQueryAlbum} from './album.store';
import {StateStore} from '../state/state.store';
import {TrackStore} from '../track/track.store';
import {MetaDataService} from '../../engine/metadata/metadata.service';
import {StateService} from '../state/state.service';
import {ImageService} from '../../engine/image/image.service';
import {DownloadService} from '../../engine/download/download.service';
import {ListService} from '../../engine/list/list.service';
import {Album} from './album.model';
import {User} from '../user/user.model';

export class AlbumController extends BaseListController<JamParameters.Album, JamParameters.Albums, JamParameters.IncludesAlbum, SearchQueryAlbum, JamParameters.AlbumSearch, Album, Jam.Album> {

	constructor(
		private trackController: TrackController,
		private trackStore: TrackStore,
		private albumStore: AlbumStore,
		private metaDataService: MetaDataService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService,
		protected listService: ListService
	) {
		super(albumStore, DBObjectType.album, stateService, imageService, downloadService, listService);
	}

	async prepare(album: Album, includes: JamParameters.IncludesAlbum, user: User): Promise<Jam.Album> {
		const result = formatAlbum(album, includes);
		if (includes.albumState) {
			result.state = await this.stateService.findOrCreate(album.id, user.id, DBObjectType.album);
		}
		if (includes.albumInfo) {
			const info = await this.metaDataService.getAlbumInfo(album);
			result.info = formatAlbumInfo(info);
		}
		if (includes.albumTracks) {
			let tracks = await this.trackStore.byIds(album.trackIDs);
			tracks = defaultTrackSort(tracks);
			result.tracks = await this.trackController.prepareList(tracks, includes, user);
		}
		return result;
	}

	translateQuery(query: JamParameters.AlbumSearch, user: User): SearchQueryAlbum {
		return {
			query: query.query,
			name: query.name,
			rootID: query.rootID,
			artist: query.artist,
			artistID: query.artistID,
			trackID: query.trackID,
			mbAlbumID: query.mbAlbumID,
			mbArtistID: query.mbArtistID,
			genre: query.genre,
			newerThan: query.newerThan,
			fromYear: query.fromYear,
			toYear: query.toYear,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async similarTracks(req: JamRequest<JamParameters.SimilarTracks>): Promise<Array<Jam.Track>> {
		const album = await this.byID(req.query.id);
		const tracks = await this.metaDataService.getAlbumSimilarTracks(album);
		return this.trackController.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
	}

	async list(req: JamRequest<JamParameters.AlbumList>): Promise<Array<Jam.Album>> {
		return this.getList(req.query, req.query, req.query, req.user);
	}

	async tracks(req: JamRequest<JamParameters.Tracks>): Promise<Array<Jam.Track>> {
		const albums = await this.byIDs(req.query.ids);
		let trackIDs: Array<string> = [];
		albums.forEach(album => {
			trackIDs = trackIDs.concat(album.trackIDs);
		});
		return this.trackController.prepareListByIDs(trackIDs, req.query, req.user);
	}

}