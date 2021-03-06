import {Jam} from '../../../model/jam-rest-data';
import {RootScanStrategy} from '../../../model/jam-types';
import {AudioModule} from '../../../modules/audio/audio.module';
import {ImageModule} from '../../../modules/image/image.module';
import {deepCompare} from '../../../utils/deep-compare';
import {logger} from '../../../utils/logger';
import {Store} from '../../store/store';
import {Changes} from '../changes/changes';
import {MatchDir} from '../match-dir/match-dir.types';
import {MatchDirMergeBuilder, MatchDirMergeTagBuilder, MergeMatchDir} from './merge.match-dir.builder';
import {processQueue} from '../../../utils/queue';

const log = logger('IO.MatchDirMerge');

export class MatchDirMerge {
	folderBuilder: MatchDirMergeBuilder;
	tagBuilder: MatchDirMergeTagBuilder;

	constructor(
		private audioModule: AudioModule, private imageModule: ImageModule,
		private store: Store, private settings: Jam.AdminSettingsLibrary, private strategy: RootScanStrategy
	) {
		this.folderBuilder = new MatchDirMergeBuilder(audioModule, store);
		this.tagBuilder = new MatchDirMergeTagBuilder(settings, strategy, imageModule);
	}

	private static folderHasChanged(dir: MergeMatchDir): boolean {
		return (!dir.folder) ||
			(dir.stat.mtime !== dir.folder.stat.modified) ||
			(dir.stat.ctime !== dir.folder.stat.created) ||
			(!deepCompare(dir.folder.tag, dir.tag));
	}

	private static async mergeRecursive(dir: MergeMatchDir, changes: Changes): Promise<void> {
		log.debug('Check For Changes:', dir.name);
		if (MatchDirMerge.folderHasChanged(dir)) {
			log.info('Folder Changed:', dir.name);
			const folder = MatchDirMergeBuilder.buildFolder(dir);
			folder.id = dir.folder.id;
			dir.folder = folder;
			const newFolder = changes.newFolders.find(f => f.id === folder.id);
			if (!newFolder) {
				changes.updateFolders.push(folder);
			} else {
				changes.newFolders = changes.newFolders.filter(f => f.id !== folder.id);
				changes.newFolders.push(folder);
			}
		}
		if (dir.directories.length > 0) {
			await processQueue<MergeMatchDir>(3, dir.directories, async d => {
				await MatchDirMerge.mergeRecursive(d, changes);
			});
		}
		// for (const d of dir.directories) {
		// 	await MatchDirMerge.mergeRecursive(d, changes);
		// }
	}

	async merge(dir: MatchDir, rootID: string, rebuildDirTag: (dir: MatchDir) => boolean, forceTrackMetaRefresh: boolean, changes: Changes): Promise<void> {
		const mergeMatchDir = await this.folderBuilder.buildMerge(dir, changes, forceTrackMetaRefresh);
		await this.tagBuilder.buildMergeTags(mergeMatchDir, rebuildDirTag);
		await MatchDirMerge.mergeRecursive(mergeMatchDir, changes);
	}

}
