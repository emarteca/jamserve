import fse from 'fs-extra';
import path from 'path';
import {DBObjectType} from '../../db/db.types';
import {PodcastStatus} from '../../model/jam-types';
import {ImageModule} from '../../modules/image/image.module';
import {ApiBinaryResult} from '../../typings';
import {DebouncePromises} from '../../utils/debounce-promises';
import {Feed} from '../../utils/feed';
import {pathDeleteIfExists} from '../../utils/fs-utils';
import {logger} from '../../utils/logger';
import {BaseListService} from '../base/dbobject-list.service';
import {Episode} from '../episode/episode.model';
import {EpisodeService} from '../episode/episode.service';
import {StateService} from '../state/state.service';
import {Podcast} from './podcast.model';
import {PodcastStore, SearchQueryPodcast} from './podcast.store';

const log = logger('PodcastService');

export class PodcastService extends BaseListService<Podcast, SearchQueryPodcast> {
	private podcastRefreshDebounce = new DebouncePromises<void>();

	constructor(private podcastsPath: string, public podcastStore: PodcastStore, private episodeService: EpisodeService, private imageModule: ImageModule, stateService: StateService) {
		super(podcastStore, stateService);
	}

	defaultSort(items: Array<Podcast>): Array<Podcast> {
		return items.sort((a, b) => (a.tag && a.tag.title ? a.tag.title : a.url).localeCompare((b.tag && b.tag.title ? b.tag.title : b.url)));
	}

	isDownloading(podcastId: string): boolean {
		return this.podcastRefreshDebounce.isPending(podcastId);
	}

	async create(url: string): Promise<Podcast> {
		const podcast: Podcast = {
			id: '',
			type: DBObjectType.podcast,
			created: Date.now(),
			lastCheck: 0,
			url,
			status: PodcastStatus.new
		};
		podcast.id = await this.podcastStore.add(podcast);
		return podcast;
	}

	async remove(podcast: Podcast): Promise<void> {
		await this.podcastStore.remove(podcast.id);
		await this.episodeService.removeEpisodes(podcast.id);
		const p = path.resolve(this.podcastsPath, podcast.id);
		await pathDeleteIfExists(p);
		await this.imageModule.clearImageCacheByIDs([podcast.id]);
	}

	async refresh(podcast: Podcast): Promise<void> {
		if (this.podcastRefreshDebounce.isPending(podcast.id)) {
			return this.podcastRefreshDebounce.append(podcast.id);
		}
		this.podcastRefreshDebounce.setPending(podcast.id);
		try {
			log.debug('Refreshing Podcast', podcast.url);
			const feed = new Feed();
			let episodes: Array<Episode> = [];
			try {
				const result = await feed.get(podcast);
				if (result) {
					podcast.tag = result.tag;
					episodes = result.episodes;
				}
				podcast.status = PodcastStatus.completed;
				podcast.errorMessage = undefined;
			} catch (e) {
				log.info('Refreshing Podcast failed', e);
				podcast.status = PodcastStatus.error;
				podcast.errorMessage = (e || '').toString();
			}
			podcast.lastCheck = Date.now();
			if (podcast.image) {
				const imageFile = path.resolve(this.podcastsPath, podcast.id, podcast.image);
				if (!(await fse.pathExists(imageFile))) {
					podcast.image = undefined;
				}
			}
			if (!podcast.image && podcast.tag && podcast.tag.image) {
				log.info('Try downloading Podcast image');
				const podcastPath = path.resolve(this.podcastsPath, podcast.id);
				await fse.ensureDir(podcastPath);
				try {
					podcast.image = await this.imageModule.storeImage(podcastPath, 'cover', podcast.tag.image);
				} catch (e) {
					podcast.image = undefined;
					log.info('Downloading Podcast image failed', e);
				}
			}
			await this.podcastStore.replace(podcast);
			const newEpisodes = await this.episodeService.mergeEpisodes(podcast.id, podcast.tag ? podcast.tag.title : podcast.url, episodes);
			log.info(`${podcast.url}: New Episodes: ${newEpisodes.length}`);
			this.podcastRefreshDebounce.resolve(podcast.id, undefined);
		} catch (e) {
			this.podcastRefreshDebounce.resolve(podcast.id, undefined);
			return Promise.reject(e);
		}
	}

	async refreshPodcasts(): Promise<void> {
		log.info('Refreshing');
		const podcasts = await this.podcastStore.all();
		for (const podcast of podcasts) {
			await this.refresh(podcast);
		}
		log.info('Refreshed');
	}

	async getImage(podcast: Podcast, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (podcast.image) {
			return this.imageModule.get(podcast.id, path.join(this.podcastsPath, podcast.id, podcast.image), size, format);
		}
	}

	async getEpisodeImage(episode: Episode, size: number | undefined, format: string | undefined): Promise<ApiBinaryResult | undefined> {
		const result = await this.episodeService.getImage(episode, size, format);
		if (!result) {
			const podcast = await this.podcastStore.byId(episode.podcastID);
			if (podcast) {
				return this.getImage(podcast, size, format);
			}
		}
		return result;
	}
}
