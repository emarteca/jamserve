import {Store} from './store';
import fse from 'fs-extra';
import path from 'path';
import {randomInt} from '../../utils/random';
import {SynchrounousResult} from 'tmp';
import tmp from 'tmp';
import {ID3v2, IID3V2} from 'jamp3';
import {scanDir, ScanDir} from '../io/components/scan';
import {matchDir, MatchDir} from '../io/components/match';
import {DBObjectType} from '../../types';
import {Root} from '../../objects/root/root.model';
import {MergeChanges, Merger} from '../io/components/merge';
import {AudioService} from '../audio/audio.service';
import {ThirdPartyConfig} from '../../config/thirdparty.config';

interface MockTrack {
	path: string;
}

interface MockFolder {
	path: string;
	name: string;
	folders: Array<MockFolder>;
	tracks: Array<MockTrack>;
}

interface MockRoot {
	path: string;
	name: string;
	folders: Array<MockFolder>;
}

function buildRandomTrack(dir: string, name: string, nr: number): MockTrack {
	return {
		path: path.resolve(dir, nr + ' ' + name + '.mp3')
	};
}

function buildRandomFolder(dir: string, type: string, nr: number): MockFolder {
	return {
		path: path.resolve(dir, type + ' ' + nr),
		name: type + nr,
		folders: [],
		tracks: []
	};
}

function buildRandomMockRoot(dir: string, nr: number): MockRoot {
	const rootDir = path.resolve(dir, 'root ' + nr);
	const folders: Array<MockFolder> = [];
	const amountArtists = randomInt(1, 25);
	for (let i = 1; i < amountArtists; i++) {
		const artist = buildRandomFolder(rootDir, 'artist', i);
		folders.push(artist);
		const amountAlbums = randomInt(1, 25);
		for (let j = 1; j < amountAlbums; j++) {
			const album = buildRandomFolder(artist.path, 'album', i);
			artist.folders.push(album);
			const amountTracks = randomInt(1, 25);
			for (let k = 1; k < amountTracks; k++) {
				const track = buildRandomTrack(album.path, artist.name + album.name, k);
				album.tracks.push(track);
			}
		}
	}
	return {
		path: rootDir,
		name: 'root' + nr,
		folders
	};
}

async function writeMockTrack(track: MockTrack): Promise<void> {
	const t: IID3V2.Tag = {
		id: 'ID3v2',
		head: {
			ver: 4,
			rev: 0,
			size: 0,
			valid: true
		},
		start: 0,
		end: 0,
		frames: []
	};
	const id3v2 = new ID3v2();
	await id3v2.write(track.path, t, t.head.ver, 0);
}

async function writeMockFolder(f: MockFolder): Promise<void> {
	await fse.ensureDir(f.path);
	for (const folder of f.folders) {
		await writeMockFolder(folder);
	}
	for (const track of f.tracks) {
		await writeMockTrack(track);
	}
}

async function writeMockRoot(root: MockRoot): Promise<void> {
	await fse.ensureDir(root.path);
	for (const folder of root.folders) {
		await writeMockFolder(folder);
	}
}

export class TestDataStore {
	// @ts-ignore
	dir: SynchrounousResult;
	// @ts-ignore
	mockRoot: MockRoot;

	constructor(private store: Store) {
	}

	async setup(): Promise<void> {
		this.dir = tmp.dirSync();
		this.mockRoot = buildRandomMockRoot(this.dir.name, 1);
		const audioService = new AudioService(ThirdPartyConfig);
		await writeMockRoot(this.mockRoot);
		const root: Root = {
			id: '',
			type: DBObjectType.root,
			name: this.mockRoot.name,
			path: this.mockRoot.path,
			created: Date.now()
		};
		root.id = await this.store.rootStore.add(root);
		const changes: MergeChanges = {
			newTracks: [],
			unchangedTracks: [],
			unchangedFolders: [],
			removedTracks: [],
			updateTracks: [],
			newFolders: [],
			removedFolders: [],
			updateFolders: []
		};
		const scan: ScanDir = await scanDir(this.mockRoot.path);
		const match: MatchDir = await matchDir(scan, this.store, root.id);
		const merger = new Merger(root.id, this.store, audioService, (count: number) => {
			// this.scanningCount = count;
		});
		await await merger.merge(match, changes);
		// console.log(this.dir.name, match, changes);
	}

	async cleanup() {
		// await fse.remove(this.dir.name);
	}
}
