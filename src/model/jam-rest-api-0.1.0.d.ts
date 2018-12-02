import {MusicBrainz} from './musicbrainz-rest-data-2.0';
import {LastFM} from './lastfm-rest-data-2.0';
import {Acoustid} from './acoustid-rest-data-2.0';
import {Jam} from './jam-rest-data-0.1.0';
import {JamParameters} from './jam-rest-params-0.1.0';

export interface JamApiErrorUnauthorized {
	error: 401;
	text: 'unauthorized';
}

export interface JamApiErrorGeneric {
	error: 500;
	text: 'internal server error';
}

export interface JamApiErrorParameters {
	error: 400;
	text: 'parameter is missing or invalid';
}

export interface JamApiErrorNotFound {
	error: 404;
	text: 'requested object not found';
}

export type JamApiImageTypes = ['image/jpeg', 'image/png'];
export type JamApiDownloadTypes = ['application/zip', 'application/tar'];
export type JamApiStreamTypes = ['audio/mpeg', 'audio/flac', 'audio/mp4', 'audio/ogg', 'audio/x-flv'];
export type JamApiDefaultStreamTypes = ['audio/mpeg'];
export type JamApiWaveformTypes = ['image/svg+xml', 'application/json', 'application/binary'];
export type JamApiDefaultDownloadTypes = ['application/zip'];

export interface JamApi {

	GET: {
		/**
		 * various: is the api online?
		 */
		'ping'?: {
			result: Jam.Ping;
			public: true;
		};
		/**
		 * auth: check the login state
		 */
		'session'?: {
			result: Jam.Session;
			public: true;
		};

		/**
		 * metadata: lookup lastfm data
		 */
		'lastfm/lookup'?: {
			operationId: 'metadata.lastfmLookup'
			params: JamParameters.LastFMLookup;
			result: LastFM.Result;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * metadata: lookup acoustid data
		 */
		'acoustid/lookup'?: {
			operationId: 'metadata.acoustidLookup'
			params: JamParameters.AcoustidLookup;
			result: Array<Acoustid.Result>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * metadata: lookup musicbrainz data
		 */
		'brainz/lookup'?: {
			operationId: 'metadata.brainzLookup'
			params: JamParameters.BrainzLookup;
			result: MusicBrainz.Response;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * metadata: search musicbrainz data
		 */
		'brainz/search'?: {
			operationId: 'metadata.brainzSearch'
			params: JamParameters.BrainzSearch;
			result: MusicBrainz.Response;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		/**
		 * various: autocomplete
		 */
		'autocomplete'?: {
			operationId: 'autocomplete.autocomplete'
			params: JamParameters.AutoComplete;
			result: Jam.AutoComplete;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * various: get list of genres found in the library
		 */
		'genre/list'?: {
			params: JamParameters.Genres;
			result: Array<Jam.Genre>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * various: get list of tracks played by all users
		 */
		'nowPlaying/list'?: {
			result: Array<Jam.NowPlaying>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric;
		};

		/**
		 * chat: get chat messages
		 */
		'chat/list'?: {
			params: JamParameters.Chat;
			result: Array<Jam.ChatMessage>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		/**
		 * folder: get the navigation index for folders
		 */
		'folder/index'?: {
			params: JamParameters.Index;
			result: Jam.FolderIndex;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * folder: get a folder by id
		 */
		'folder/id'?: {
			params: JamParameters.Folder;
			result: Jam.Folder;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get folders by ids
		 */
		'folder/ids'?: {
			params: JamParameters.Folders;
			result: Array<Jam.Folder>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * folder: get tracks and subfolders of a folder by id
		 */
		'folder/children'?: {
			params: JamParameters.FolderChildren;
			result: Jam.FolderChildren;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get tracks of a folder by id
		 */
		'folder/tracks'?: {
			params: JamParameters.FolderTracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get sub folders of a folder by id
		 */
		'folder/subfolders'?: {
			params: JamParameters.FolderSubFolders;
			result: Array<Jam.Folder>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get similar artist folders of a folder by id
		 */
		'folder/artist/similar'?: {
			params: JamParameters.Folder;
			result: Array<Jam.Folder>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get extended artist meta data of a folder by id
		 */
		'folder/artist/info'?: {
			params: JamParameters.ArtistInfo;
			result: Jam.ArtistFolderInfo;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get extended album meta data of a folder by id
		 */
		'folder/album/info'?: {
			params: JamParameters.AlbumInfo;
			result: Jam.AlbumFolderInfo;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get a list of folders by list type
		 */
		'folder/list'?: {
			params: JamParameters.FolderList;
			result: Array<Jam.Folder>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * folder: search folders
		 */
		'folder/search'?: {
			params: JamParameters.FolderSearch;
			result: Array<Jam.Folder>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * folder: get the user state (fav/rating) by folder id
		 */
		'folder/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get the user states (fav/rating) by folders ids
		 */
		'folder/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get similar tracks of a by artist folder id
		 */
		'folder/artist/similar/tracks'?: {
			params: JamParameters.SimilarTracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		/**
		 * track: get a track by id
		 */
		'track/id'?: {
			params: JamParameters.Track;
			result: Jam.Track;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * track: get tracks by ids
		 */
		'track/ids'?: {
			params: JamParameters.Tracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * track: get an id3 tag by track id
		 */
		'track/tagID3'?: {
			params: JamParameters.ID;
			result: Jam.ID3Tag;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * track: get id3 tags by track ids
		 */
		'track/tagID3s'?: {
			params: JamParameters.IDs;
			result: Jam.ID3Tags;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * track: search tracks
		 */
		'track/search'?: {
			params: JamParameters.TrackSearch;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * track: get the user state (fav/rating) by track id
		 */
		'track/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * track: get the user states (fav/rating) by track ids
		 */
		'track/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * track: get a track list by track list type
		 */
		'track/list'?: {
			params: JamParameters.TrackList;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * track: get the similar tracks by track id
		 */
		'track/similar'?: {
			params: JamParameters.SimilarTracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'episode/id'?: {
			params: JamParameters.Episode;
			result: Jam.PodcastEpisode;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'episode/ids'?: {
			params: JamParameters.Episodes;
			result: Array<Jam.PodcastEpisode>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'episode/search'?: {
			params: JamParameters.EpisodeSearch;
			result: Array<Jam.PodcastEpisode>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'episode/retrieve'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'episode/state'?: {
			params: JamParameters.ID;
			result: Jam.State
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'episode/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'episode/status'?: {
			params: JamParameters.ID;
			result: Jam.PodcastEpisodeStatus;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		'podcast/id'?: {
			params: JamParameters.Podcast;
			result: Jam.Podcast;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'podcast/ids'?: {
			params: JamParameters.Podcasts;
			result: Array<Jam.Podcast>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'podcast/status'?: {
			params: JamParameters.ID;
			result: Jam.PodcastStatus;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'podcast/search'?: {
			params: JamParameters.PodcastSearch;
			result: Array<Jam.Podcast>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'podcast/refreshAll'?: {};
		'podcast/refresh'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'podcast/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'podcast/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'artist/id'?: {
			params: JamParameters.Artist;
			result: Jam.Artist;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'artist/ids'?: {
			params: JamParameters.Artists;
			result: Array<Jam.Artist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'artist/search'?: {
			params: JamParameters.ArtistSearch;
			result: Array<Jam.Artist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'artist/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'artist/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'artist/list'?: {
			params: JamParameters.ArtistList;
			result: Array<Jam.Artist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'artist/similar/tracks'?: {
			params: JamParameters.SimilarTracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'artist/similar'?: {
			params: JamParameters.Artist;
			result: Array<Jam.Artist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'artist/index'?: {
			params: JamParameters.Index;
			result: Jam.ArtistIndex
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'artist/tracks'?: {
			params: JamParameters.Tracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'album/id'?: {
			params: JamParameters.Album;
			result: Jam.Album;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'album/ids'?: {
			params: JamParameters.Albums;
			result: Array<Jam.Album>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'album/list'?: {
			params: JamParameters.AlbumList;
			result: Array<Jam.Album>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'album/search'?: {
			params: JamParameters.AlbumSearch;
			result: Array<Jam.Album>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'album/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'album/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'album/similar/tracks'?: {
			params: JamParameters.SimilarTracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'album/tracks'?: {
			params: JamParameters.Tracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'playlist/id'?: {
			params: JamParameters.Playlist;
			result: Jam.Playlist;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'playlist/ids'?: {
			params: JamParameters.Playlists;
			result: Array<Jam.Playlist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'playlist/search'?: {
			params: JamParameters.PlaylistSearch;
			result: Array<Jam.Playlist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'playlist/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'playlist/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'playlist/tracks'?: {
			params: JamParameters.Tracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'user/search'?: {
			params: JamParameters.UserSearch;
			result: Array<Jam.User>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};
		'user/id'?: {
			params: JamParameters.ID;
			result: Jam.User;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'user/ids'?: {
			params: JamParameters.IDs;
			result: Array<Jam.User>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};
		'user/playqueue'?: {
			params: JamParameters.IncludesPlayQueue;
			result: Jam.PlayQueue;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		'root/search'?: {
			params: JamParameters.RootSearch;
			result: Array<Jam.Root>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'root/id'?: {
			params: JamParameters.ID;
			result: Jam.Root;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'root/ids'?: {
			params: JamParameters.IDs;
			result: Array<Jam.Root>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'root/scan'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'root/scanAll'?: {
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric;
			roles: ['admin'];
		};
		'root/status'?: {
			params: JamParameters.ID;
			result: Jam.RootStatus;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		// binary

		'folder/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
		};
		'folder/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};

		'track/stream'?: {
			params: JamParameters.Stream;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiStreamTypes;
		};
		'track/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
		};
		'track/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};

		'episode/stream'?: {
			params: JamParameters.Stream;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiStreamTypes;
		};
		'episode/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
		};
		'episode/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};

		'podcast/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};
		'podcast/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
		};

		'artist/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};
		'artist/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
		};

		'album/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};
		'album/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
		};

		/**
		 * bookmark: get a bookmarks list for the calling user
		 */
		'bookmark/list'?: {
			params: JamParameters.BookmarkList;
			result: Array<Jam.Bookmark>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'playlist/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};
		'playlist/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
		};

		'user/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};

		'root/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};

		'image/{id}-{size}.{format}'?: {
			operationId: 'image.image';
			pathParams: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};
		'image/{id}-{size}'?: {
			operationId: 'image.image';
			pathParams: JamParameters.PathImageSize;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
			aliasFor: 'image/{id}-{size}.{format}';
		};
		'image/{id}.{format}'?: {
			operationId: 'image.image';
			pathParams: JamParameters.PathImageFormat;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
			aliasFor: 'image/{id}-{size}.{format}';
		};
		'image/{id}'?: {
			operationId: 'image.image';
			pathParams: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
			aliasFor: 'image/{id}-{size}.{format}';
		};

		/**
		 * media: stream a media file in a format
		 */
		'stream/{id}.{format}'?: {
			operationId: 'stream.stream';
			pathParams: JamParameters.PathStream;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiStreamTypes;
		};
		/**
		 * media: stream a media file
		 */
		'stream/{id}'?: {
			operationId: 'stream.stream';
			pathParams: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDefaultStreamTypes;
			aliasFor: 'stream/{id}.{format}';
		};
		/**
		 * media: get peaks waveform data as svg | json | binary
		 */
		'waveform/{id}.{format}'?: {
			operationId: 'waveform.waveform';
			pathParams: JamParameters.Waveform;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiWaveformTypes;
		};

		'download/{id}'?: {
			operationId: 'download.download';
			pathParams: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDefaultDownloadTypes;
			aliasFor: 'download/{id}.{format}';
		};
		'download/{id}.{format}'?: {
			operationId: 'download.download';
			pathParams: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
		};
	};

	POST: {
		/**
		 * auth: login an user
		 *
		 */
		'login'?: {
			params: JamParameters.Login;
			/**
			 * returns a Jam.Session on success
			 */
			result: Jam.Session;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			public: true;
		};
		/**
		 * auth: logout an user
		 */
		'logout'?: {
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric;
		};

		/**
		 * bookmark: delete a bookmark
		 */
		'bookmark/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'podcast/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'chat/delete'?: {
			params: JamParameters.ChatDelete;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'playlist/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'user/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'root/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};

		'chat/create'?: {
			params: JamParameters.ChatNew;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		'track/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'track/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'track/tagID3/update'?: {
			params: JamParameters.TagID3Update;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'track/tagID3s/update'?: {
			params: JamParameters.TagID3sUpdate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};

		'folder/imageUpload/update'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
			upload: 'image'
		};
		'folder/imageUrl/update'?: {
			params: JamParameters.FolderEditImg;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'folder/name/update'?: {
			params: JamParameters.FolderEditName;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'folder/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'folder/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		/**
		 * bookmark: create a bookmark
		 */
		'bookmark/create'?: {
			params: JamParameters.BookmarkCreate;
			result: Jam.Bookmark;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		'album/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'album/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'artist/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'artist/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'episode/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'episode/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'podcast/create'?: {
			params: JamParameters.PodcastNew;
			result: Jam.Podcast;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};
		'podcast/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'podcast/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'playlist/create'?: {
			params: JamParameters.PlaylistNew;
			result: Jam.Playlist;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'playlist/update'?: {
			params: JamParameters.PlaylistUpdate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'playlist/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'playlist/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'user/playqueue/update'?: {
			params: JamParameters.PlayQueueSet;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'user/create'?: {
			params: JamParameters.UserNew;
			result: Jam.User;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};
		'user/update'?: {
			params: JamParameters.UserUpdate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'user/imageUpload/update'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			upload: 'image'
		};

		'root/create'?: {
			params: JamParameters.RootNew;
			result: Jam.Root;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};
		'root/update'?: {
			params: JamParameters.RootUpdate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};

	};
}

