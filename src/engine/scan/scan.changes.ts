import {Track} from '../../objects/track/track.model';
import {Artist} from '../../objects/artist/artist.model';
import {Album} from '../../objects/album/album.model';
import {Folder} from '../../objects/folder/folder.model';
import Logger from '../../utils/logger';
import moment from 'moment';

const log = Logger('IO.MergeChanges');

export interface MergeChangesTrackInfo {
	track: Track;
	oldTrack: Track;
}

export interface MergeChanges {
	newArtists: Array<Artist>;
	updateArtists: Array<Artist>;
	removedArtists: Array<Artist>;

	newAlbums: Array<Album>;
	updateAlbums: Array<Album>;
	removedAlbums: Array<Album>;

	newTracks: Array<Track>;
	updateTracks: Array<MergeChangesTrackInfo>;
	removedTracks: Array<Track>;

	newFolders: Array<Folder>;
	updateFolders: Array<Folder>;
	removedFolders: Array<Folder>;

	start: number;
	end: number;
}

function logChange(name: string, list: Array<any>) {
	if (list.length > 0) {
		log.info(name, list.length);
	}
}

export function logChanges(changes: MergeChanges) {
	const v = moment.utc(changes.end - changes.start).format('HH:mm:ss.SSS');
	log.info('Duration:', v);
	logChange('Added Tracks', changes.newTracks);
	logChange('Updated Tracks', changes.updateTracks);
	logChange('Removed Tracks', changes.removedTracks);
	logChange('Added Folders', changes.newFolders);
	logChange('Updated Folders', changes.updateFolders);
	logChange('Removed Folders', changes.removedFolders);
	logChange('Added Artists', changes.newArtists);
	logChange('Updated Artists', changes.updateArtists);
	logChange('Removed Artists', changes.removedArtists);
	logChange('Added Albums', changes.newAlbums);
	logChange('Updated Albums', changes.updateAlbums);
	logChange('Removed Albums', changes.removedAlbums);
}

export function  emptyChanges(): MergeChanges {
	const changes: MergeChanges = {
		newArtists: [],
		updateArtists: [],
		removedArtists: [],

		newAlbums: [],
		updateAlbums: [],
		removedAlbums: [],

		newTracks: [],
		updateTracks: [],
		removedTracks: [],

		newFolders: [],
		updateFolders: [],
		removedFolders: [],
		start: Date.now(),
		end: 0,
	};
	return changes;
}