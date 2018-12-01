import ffmpeg from 'fluent-ffmpeg';
import express from 'express';
import tmp from 'tmp';
import {IStreamData} from '../../typings';
import Logger from '../../utils/logger';
import * as fs from 'fs';
import {TrackMedia} from '../../objects/track/track.model';

const log = Logger('audio.transcoder');

export class Transcoder implements IStreamData {
	filename: string;
	format: string;
	maxBitRate: number;
	duration?: number;

	constructor(filename: string, format: string, maxBitRate: number, duration?: number) {
		this.filename = filename;
		this.format = format;
		this.maxBitRate = maxBitRate;
		this.duration = duration;
		if (maxBitRate <= 0) {
			this.maxBitRate = 128;
		}
	}

	static needsTranscoding(mediaFormat: string, format: string, maxBitRate: number) {
		return (format !== mediaFormat) || (maxBitRate > 0);
	}

	static validTranscoding(media: TrackMedia, format: string) {
		return ['mp3', 'flv', 'ogg', 'oga', 'flac', 'mp4'].indexOf(format) >= 0;
	}

	static async getAvailableFormats(): Promise<Array<{ format: string, name: string }>> {
		return new Promise<Array<{ format: string, name: string }>>((resolve, reject) => {
			ffmpeg().getAvailableFormats((err, formats) => {
				if (err || !formats) {
					return reject(err);
				}
				resolve(Object.keys(formats).filter(key => formats[key].canDemux).map(key => {
					return {format: key, name: formats[key].description};
				}));
			});
		});
	}

	//
	// private getSize(cb: (length: number) => void) {
	// 	if (this.duration !== undefined && this.duration > 0) {
	// 		const length = Math.round((this.maxBitRate * 1000 * this.duration) / 8);
	// 		return cb(length);
	// 	}
	// 	ffmpeg.ffprobe(this.filename, (err, metadata) => {
	// 		let length = 0;
	// 		if (metadata && metadata.format && metadata.format.duration) {
	// 			const duration = metadata.format ? parseInt(metadata.format.duration, 10) : 0;
	// 			length = Math.round((this.maxBitRate * 1000 * duration) / 8);
	// 		}
	// 		cb(length);
	// 	});
	// }

	pipe(stream: express.Response) {
		log.info('Start transcode streaming', this.format, this.maxBitRate);
		const proc = ffmpeg(<ffmpeg.FfmpegCommandOptions>{source: this.filename, nolog: true});
		if (this.format === 'mp3') {
			proc.withAudioCodec('libmp3lame');
		}
		proc.withNoVideo()
			.toFormat(this.format)
			.withAudioBitrate(this.maxBitRate + 'k')
			.on('end', () => {
				log.debug('file has been transcoded successfully');
			})
			.on('error', (err: Error) => {
				log.error('an error happened while transcoding: ' + err.message);
			});
		stream.contentType(this.format);
		proc.writeToStream(stream, {end: true});
	}

}

export class PreTranscoder implements IStreamData {
	filename: string;
	format: string;
	maxBitRate: number;

	constructor(filename: string, format: string, maxBitRate: number) {
		this.filename = filename;
		this.format = format;
		this.maxBitRate = maxBitRate;
		if (maxBitRate <= 0) {
			this.maxBitRate = 128;
		}
	}

	pipe(stream: express.Response) {
		log.info('Start transcode first and stream after', this.format, this.maxBitRate);
		tmp.file((err, filename, fd, cleanupCallback) => {
			if (err) {
				throw err;
			}
			const proc = ffmpeg(<ffmpeg.FfmpegCommandOptions>{source: this.filename, nolog: true});
			if (this.format === 'mp3') {
				proc.withAudioCodec('libmp3lame');
			}
			proc.withNoVideo()
				.toFormat(this.format)
				.withAudioBitrate(this.maxBitRate + 'k')
				.on('end', () => {
					log.info('file has been transcoded successfully, sending it now');
					stream.contentType(this.format);
					stream.setHeader('Content-Length', fs.statSync(filename).size);
					const rs = fs.createReadStream(filename, {autoClose: true});
					rs.on('end', () => {
						cleanupCallback();
					});
					rs.on('error', () => {
						cleanupCallback();
					});
					rs.pipe(stream);
				})
				.on('error', (err2: Error) => {
					cleanupCallback();
					const msg = 'an error happened while transcoding: ' + err2.message;
					stream.status(400).send(msg);
					log.error(msg);
				});
			proc.save(filename);
		});
	}

}
