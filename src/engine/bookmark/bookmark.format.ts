import {Jam} from '../../model/jam-rest-data';
import {Bookmark} from './bookmark.model';

export function formatBookmark(bookmark: Bookmark): Jam.Bookmark {
	return {
		id: bookmark.id,
		trackID: bookmark.destID,
		comment: bookmark.comment,
		created: bookmark.created,
		changed: bookmark.changed,
		position: bookmark.position
	};
}
