import fse from 'fs-extra';
import {ID3v2, IID3V2, ITagID} from 'jamp3';

export async function writeMP3Track(filename: string, album: string, artist: string, trackNr: number, genre: string, albumArtist?: string, series?: string, group?: string): Promise<void> {
	const mp3stub = Buffer.from(
		[255, 227, 24, 196, 0, 12, 200, 7, 18, 88, 8, 68, 2, 187, 109, 182, 167, 108, 0, 24, 62, 15, 131, 224, 248,
			32, 8, 2, 0, 128, 38, 15, 131, 224, 248, 62, 8, 2, 0, 128, 32, 3, 7, 193, 240, 124, 252, 160, 32, 239,
			33, 203, 131, 129, 143, 233, 39, 164, 16, 117, 64, 55, 247, 116, 170, 251, 109, 108, 33, 80, 0, 200, 255,
			227, 24, 196, 7, 12, 184, 2, 242, 88, 0, 70, 1, 40, 40, 40, 36, 20, 20, 20, 20, 40, 40, 40, 40, 36, 20,
			20, 20, 20, 40, 40, 40, 40, 36, 20, 20, 20, 23, 255, 254, 144, 80, 80, 83, 113, 5, 5, 52, 24, 40, 111,
			255, 255, 130, 146, 27, 245, 255, 250, 42, 42, 42, 42, 39, 238, 37, 9, 17, 82, 199, 74, 255, 227, 24,
			196, 15, 11, 169, 73, 128, 0, 0, 146, 81, 23, 64, 124, 76, 21, 17, 12, 135, 134, 196, 2, 178, 67, 34,
			162, 18, 199, 74, 23, 32, 70, 218, 42, 170, 170, 154, 105, 134, 33, 244, 211, 74, 76, 65, 77, 69, 51,
			46, 57, 57, 46, 53, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170]
	);
	await fse.writeFile(filename, mp3stub);
	const t: IID3V2.Tag = {
		id: ITagID.ID3v2,
		start: 0,
		end: 0,
		frames: [
			{
				id: 'TALB',
				value: {
					text: album
				}
			},
			{
				id: 'TPE1',
				value: {
					text: artist
				}
			},
			{
				id: 'TCON',
				value: {
					text: genre
				}
			},
			{
				id: 'TRCK',
				value: {
					text: trackNr.toString()
				}
			}
		]
	};
	if (albumArtist) {
		t.frames.push({
			id: 'TPE2',
			value: {
				text: albumArtist
			}
		});
	}
	if (group) {
		t.frames.push({
			id: 'GRP1',
			value: {
				text: group
			}
		});
	}
	if (series) {
		t.frames.push({
			id: 'TIT1',
			value: {
				text: series
			}
		});
	}
	const id3v2 = new ID3v2();
	await id3v2.write(filename, t, 4, 0, {keepBackup: false});
}
