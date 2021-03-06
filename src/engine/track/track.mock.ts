import {DBObjectType} from '../../db/db.types';
import {AudioFormatType, TrackTagFormatType} from '../../model/jam-types';
import {mockPath} from '../../utils/testutils.spec';
import {Track} from './track.model';

export function mockTrack(): Track {
	return {
		id: '',
		type: DBObjectType.track,
		rootID: 'rootID1',
		parentID: 'folderID1',
		albumID: 'albumID1',
		artistID: 'artistID1',
		albumArtistID: 'albumArtistID1',
		name: 'a folder name',
		path: mockPath('folder name'),
		stat: {
			created: 1543495268,
			modified: 1543495268,
			size: 9001
		},
		tag: {
			format: TrackTagFormatType.id3v23,
			album: 'an album name',
			albumSort: 'album sort name, an',
			albumArtist: 'an album artist name',
			albumArtistSort: 'album artist sort name, an',
			artist: 'an artist name',
			artistSort: 'artist sort name, an',
			genre: 'a genre name',
			disc: 3,
			title: 'a title',
			titleSort: 'title sort, a',
			track: 3,
			year: 1984,
			mbTrackID: 'mbTrackID1',
			mbAlbumType: 'mbAlbumType1',
			mbAlbumArtistID: 'mbAlbumArtistID1',
			mbArtistID: 'mbArtistID1',
			mbReleaseID: 'mbReleaseID1',
			mbReleaseTrackID: 'mbReleaseTrackID1',
			mbReleaseGroupID: 'mbReleaseGroupID1',
			mbRecordingID: 'mbRecordingID1',
			mbAlbumStatus: 'mbAlbumStatus1',
			mbReleaseCountry: 'mbReleaseCountry1'
		},
		media: {
			duration: 12345,
			bitRate: 56000,
			format: AudioFormatType.mp3,
			sampleRate: 44000,
			channels: 2,
			encoded: 'VBR',
			mode: 'joint',
			version: 'MPEG 1 Layer 3'
		}
	};
}

export function mockTrack2(): Track {
	return {
		id: '',
		type: DBObjectType.track,
		rootID: 'rootID2',
		parentID: 'folderID2',
		albumID: 'albumID2',
		artistID: 'artistID2',
		albumArtistID: 'albumArtistID2',
		name: 'second folder name',
		path: mockPath('second folder name'),
		stat: {
			created: 1443495268,
			modified: 1443495268,
			size: 1001
		},
		tag: {
			format: TrackTagFormatType.id3v24,
			album: 'second album name',
			albumSort: 'album sort name, second',
			albumArtist: 'second album artist name',
			albumArtistSort: 'album artist sort name, second',
			artist: 'second artist name',
			artistSort: 'artist sort name, second',
			genre: 'second genre name',
			disc: 5,
			title: 'second title',
			titleSort: 'title sort, second',
			track: 5,
			year: 2000,
			mbTrackID: 'mbTrackID2',
			mbAlbumType: 'mbAlbumType2',
			mbAlbumArtistID: 'mbAlbumArtistID2',
			mbArtistID: 'mbArtistID2',
			mbReleaseID: 'mbReleaseID2',
			mbReleaseTrackID: 'mbReleaseTrackID2',
			mbReleaseGroupID: 'mbReleaseGroupID2',
			mbRecordingID: 'mbRecordingID2',
			mbAlbumStatus: 'mbAlbumStatus2',
			mbReleaseCountry: 'mbReleaseCountry2'
		},
		media: {
			duration: 54321,
			bitRate: 128000,
			format: AudioFormatType.mp3,
			sampleRate: 22000,
			channels: 1,
			encoded: 'CBR',
			mode: 'single',
			version: 'MPEG 1 Layer 8'
		}
	};
}
