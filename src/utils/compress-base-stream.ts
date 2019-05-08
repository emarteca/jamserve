import archiver from 'archiver';
import express from 'express';
import {StreamData} from '../typings';
import {replaceFileSystemChars} from './fs-utils';

export abstract class BaseCompressStream implements StreamData {
	public filename: string;
	public streaming = true;
	public format: string;

	protected constructor(filename: string, format?: string) {
		this.filename = replaceFileSystemChars(filename, '_').replace(/ /g, '_');
		this.format = format || 'zip';
		if (!BaseCompressStream.isSupportedFormat(this.format)) {
			throw new Error('Unsupported Download Format');
		}
	}

	static isSupportedFormat(format: string): boolean {
		return ['zip', 'tar'].indexOf(format) >= 0;
	}

	pipe(stream: express.Response): void {
		// logger.verbose('Start streaming');
		const format = 'zip';
		const archive = archiver(this.format as archiver.Format, {zlib: {level: 0}});
		archive.on('error', (err) => {
			// logger.error('archiver err ' + err);
			throw err;
		});
		stream.contentType('zip');
		stream.setHeader('Content-Disposition', 'attachment; filename="' + (this.filename || 'download') + '.' + format + '"');
		// stream.setHeader('Content-Length', stat.size); do NOT report wrong size!
		stream.on('finish', () => {
			// logger.verbose('streamed ' + archive.pointer() + ' total bytes');
			this.streaming = false;
		});
		archive.pipe(stream);
		this.run(archive);
		archive.finalize();
	}

	protected abstract run(archive: archiver.Archiver): void;
}