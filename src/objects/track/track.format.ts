import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {Track, TrackTag} from './track.model';

export function formatTrackTag(tag: TrackTag): Jam.TrackTag {
	let mbz: Jam.TrackMBTag | undefined = {
		recordingID: tag.mbRecordingID,
		releaseTrackID: tag.mbReleaseTrackID,
		trackID: tag.mbTrackID,
		artistID: tag.mbArtistID,
		albumID: tag.mbAlbumID
	};
	if (!Object.keys(mbz).find(key => !!(<any>mbz)[key])) {
		mbz = undefined;
	}
	return {
		trackNr: tag.track,
		year: tag.year,
		title: tag.title,
		artist: tag.artist,
		album: tag.album,
		genre: tag.genre,
		musicbrainz: mbz
	};
}

export function formatTrack(track: Track, includes: JamParameters.IncludesTrack): Jam.Track {
	includes = includes || {};
	return {
		id: track.id,
		parentID: track.parentID,
		artistID: track.artistID,
		albumID: track.albumID,
		name: track.name,
		created: track.stat.created,
		duration: track.media.duration || -1,
		media: includes.trackMedia ? {
			bitRate: track.media.bitRate || -1,
			format: track.media.format || '',
			channels: track.media.channels || -1,
			sampleRate: track.media.sampleRate || -1
		} : undefined,
		tag: includes.trackTag ? formatTrackTag(track.tag) : undefined
	};
}