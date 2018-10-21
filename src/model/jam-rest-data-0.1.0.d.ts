import {MusicBrainz} from './musicbrainz-rest-data-2.0';
import {LastFM} from './lastfm-rest-data-2.0';
import {Acoustid} from './acoustid-rest-data-2.0';
import {ID3v2FrameValues} from './id3v2-frame-values';

export declare namespace Jam {

	export type FolderType = 'unknown' | 'artist' | 'multiartist' | 'album' | 'multialbum' | 'extras';

	export interface Ping {
		version: Version;
	}

	export type Version = string; // \d+\.\d+\.\d+

	export interface Session {
		version: Version;
		user?: Jam.User;
		jwt?: string;
		allowedCookieDomains: Array<string>;
	}

	export interface RootState {
		lastScan: number;
		error?: string;
		scanning?: boolean;
	}

	export interface Root extends Base {
		path: string;
		scanState: RootState;
	}

	export interface TrackMBTag {
		trackID?: string;
		recordingID?: string;
		releaseTrackID?: string;
		artistID?: string;
		albumID?: string;
	}

	export interface TrackTag {
		title?: string;
		album?: string;
		artist?: string;
		genre?: string;
		year?: number;
		trackNr?: number;
		musicbrainz?: TrackMBTag;
	}

	export interface TrackMedia {
		bitRate: number;
		format: string;
		channels: number;
		sampleRate: number;
	}

	export interface TrackBookmark {
		track?: Track;
		trackID: string;
		position: number;
		comment?: string;
		created: number;
		changed: number;
	}

	export interface NowPlaying {
		username: string;
		minutesAgo: number;
		track?: Track;
	}

	export interface Base {
		id: string;
		state?: State;
		name: string;
		created: number;
	}

	export interface Track extends Base {
		duration: number;
		tag?: TrackTag;
		tagID3?: ID3Tag;
		media?: TrackMedia;
		parentID: string;
		artistID?: string;
		albumID?: string;
	}

	export interface PodcastEpisode extends Track {
		podcastID: string;
		status: string;
		date: number;
		title: string;
		summary?: string;
		guid?: string;
		author?: string;
		link?: string;
		errorMessage?: string;
	}

	export interface PodcastEpisodeStatus {
		status: string; // TODO: type for Podcast Episode Status
	}

	export interface PodcastStatus {
		status: string; // TODO: type for Podcast Status
		lastCheck?: number;
	}

	export interface Podcast extends Base {
		url: string;
		status: string; // TODO: type for Podcast Status
		lastCheck?: number;
		errorMessage?: string;
		description?: string;
		episodes?: Array<PodcastEpisode>;
	}

	export interface ID3Tag {
		version: number;
		frames: ID3v2FrameValues.Frames;
	}

	export interface State {
		played?: number;
		lastplayed?: number;
		faved?: number;
		rated?: number;
	}

	export interface States {
		[id: string]: State;
	}

	export interface ID3Tags {
		[trackID: string]: ID3Tag;
	}

	export interface Folder extends Base {
		parentID?: string;
		type: FolderType;
		tag?: FolderTag;
		health?: FolderHealth;
		artistInfo?: ArtistFolderInfo;
		albumInfo?: AlbumInfo;
		folders?: Array<Folder>;
		tracks?: Array<Track>;
		parents?: Array<FolderParent>;
	}

	export interface FolderParent {
		id: string;
		name: string;
	}

	export interface FolderTag {
		album?: string;
		artist?: string;
		genre?: string;
		year?: number;
		musicbrainz?: {
			artistID?: string;
			albumID?: string;
		};
	}

	export interface FolderProblem {
		id: string;
		name: string;
	}

	export interface FolderHealth {
		problems?: Array<FolderProblem>;
	}

	export interface FolderChildren {
		folders?: Array<Folder>;
		tracks?: Array<Track>;
	}

	export interface AlbumTag {
		duration: number;
		created: number;
		genre?: string;
		year?: number;
		musicbrainz?: {
			artistID?: string;
			albumID?: string;
		};
	}

	export interface ExtendedInfo {
		description?: string;
		lastFmUrl?: string;
		smallImageUrl?: string;
		mediumImageUrl?: string;
		largeImageUrl?: string;
	}

	export interface ArtistFolderInfo extends ExtendedInfo {
		similar?: Array<{ id: string, name: string }>;
	}

	export interface AlbumFolderInfo extends ExtendedInfo {
		releases?: Array<MusicBrainz.Release>;
	}

	export interface ArtistInfo extends ExtendedInfo {
		similar?: Array<{ id: string, name: string }>;
	}

	export interface AlbumInfo extends ExtendedInfo {
		releases?: Array<MusicBrainz.Release>;
	}

	export interface Album extends Base {
		artist?: string;
		tag?: AlbumTag;
		trackCount: number;
		artistID: string;
		trackIDs?: Array<string>;
		tracks?: Array<Track>;
		info?: AlbumInfo;
	}

	export interface Artist extends Base {
		albumCount: number;
		trackCount: number;
		musicbrainz?: {
			artistID?: string;
		};
		tracks?: Array<Track>;
		trackIDs?: Array<string>;
		albumIDs?: Array<string>;
		albums?: Array<Album>;
		info?: ArtistInfo;
	}

	export interface Playlist extends Base {
		userID: string;
		isPublic: boolean;
		comment?: string;
		duration: number;
		trackCount: number;
		changed: number;
		tracks?: Array<Track>;
		trackIDs?: Array<string>;
	}

	export interface FolderIndexEntry {
		name: string;
		folderID: string;
		trackCount: number;
	}

	export interface FolderIndexGroup {
		name: string;
		entries: Array<FolderIndexEntry>;
	}

	export interface FolderIndex {
		lastModified: number;
		groups: Array<FolderIndexGroup>;
	}

	export interface ArtistIndexEntry {
		name: string;
		artistID: string;
		trackCount: number;
	}

	export interface ArtistIndexGroup {
		name: string;
		entries: Array<ArtistIndexEntry>;
	}

	export interface ArtistIndex {
		lastModified: number;
		groups: Array<ArtistIndexGroup>;
	}

	export interface Roles {
		stream?: boolean;
		upload?: boolean;
		podcast?: boolean;
		admin?: boolean;
		// coverArt?: boolean;
		// settings?: boolean;
		// download?: boolean;
		// playlist?: boolean;
		// comment?: boolean;
		// jukebox?: boolean;
		// share?: boolean;
		// videoConversion?: boolean;
	}

	export interface User extends Base {
		email: string;
		roles: Roles;
	}

	export interface Genre {
		name: string;
		trackCount: number;
		albumCount: number;
		artistCount: number;
	}

	export interface ChatMessage {
		username: string;
		time: number;
		message: string;
	}

	export interface PlayQueue {
		trackIDs?: Array<string>;
		tracks?: Array<Track>;
		currentID?: string;
		position?: number;
		changed: number;
		changedBy: string;
	}

	export interface Data {
		ping?: Ping;
		root?: Root;
		roots?: Array<Root>;
		user?: User;
		users?: Array<User>;
		nowPlaying?: Array<NowPlaying>;
		artist?: Artist;
		artists?: Array<Artist>;
		album?: Album;
		albums?: Array<Album>;
		artistInfo?: ArtistInfo;
		albumInfo?: AlbumInfo;
		artistFolderInfo?: ArtistFolderInfo;
		albumFolderInfo?: AlbumFolderInfo;
		folder?: Folder;
		episode?: PodcastEpisode;
		episodes?: Array<PodcastEpisode>;
		playlist?: Playlist;
		playlists?: Array<Playlist>;
		podcast?: Podcast;
		podcasts?: Array<Podcast>;
		track?: Track;
		tracks?: Array<Track>;
		folders?: Array<Folder>;
		bookmarks?: Array<TrackBookmark>;
		folderChildren?: FolderChildren;
		state?: State;
		states?: States;
		tagID3?: ID3Tag;
		tagID3s?: ID3Tags;
		brainz?: MusicBrainz.Response;
		lastfm?: LastFM.Result;
		acoustid?: Array<Acoustid.Result>;
		genres?: Array<Genre>;
		folderIndex?: FolderIndex;
		artistIndex?: ArtistIndex;
		chatMessages?: Array<ChatMessage>;
		playqueue?: PlayQueue;
		session?: Session;
		podcastStatus?: PodcastStatus;
		episodeStatus?: PodcastEpisodeStatus;
	}
}
