import {MetaWriteableDataBlock} from './block';

export class MetaDataBlockPicture extends MetaWriteableDataBlock {
	pictureType = 0;
	mimeType = '';
	description = '';
	width = 0;
	height = 0;
	bitsPerPixel = 0;
	colors = 0;
	pictureData?: Buffer;

	constructor(isLast: boolean) {
		super(isLast, 6);
	}

	public static createPictureBlock(pictureType: number, mimeType: string, description: string, width: number, height: number, bitsPerPixel: number, colors: number, pictureData: Buffer): MetaDataBlockPicture {
		const mdb = new MetaDataBlockPicture(false);
		mdb.pictureType = pictureType;
		mdb.mimeType = mimeType;
		mdb.description = description;
		mdb.width = width;
		mdb.height = height;
		mdb.bitsPerPixel = bitsPerPixel;
		mdb.colors = colors;
		mdb.pictureData = pictureData;
		mdb.hasData = true;
		return mdb;
	}

	parse(buffer: Buffer) {
		try {

			let pos = 0;

			this.pictureType = buffer.readUInt32BE(pos);
			pos += 4;

			const mimeTypeLength = buffer.readUInt32BE(pos);
			this.mimeType = buffer.toString('utf8', pos + 4, pos + 4 + mimeTypeLength);
			pos += 4 + mimeTypeLength;

			const descriptionLength = buffer.readUInt32BE(pos);
			this.description = buffer.toString('utf8', pos + 4, pos + 4 + descriptionLength);
			pos += 4 + descriptionLength;

			this.width = buffer.readUInt32BE(pos);
			this.height = buffer.readUInt32BE(pos + 4);
			this.bitsPerPixel = buffer.readUInt32BE(pos + 8);
			this.colors = buffer.readUInt32BE(pos + 12);
			pos += 16;

			const pictureDataLength = buffer.readUInt32BE(pos);
			this.pictureData = Buffer.alloc(pictureDataLength);
			buffer.copy(this.pictureData, 0, pos + 4, pictureDataLength);

			this.hasData = true;

		} catch (e) {
			this.error = e;
			this.hasData = false;
		}
	}

	publish() {
		let pos = 0;
		const size = this.getSize();
		const buffer = Buffer.alloc(4 + size);

		if (this.pictureData) {
			let header = size;
			header |= (this.type << 24);
			header |= (this.isLast ? 0x80000000 : 0);
			buffer.writeUInt32BE(header >>> 0, pos);
			pos += 4;

			buffer.writeUInt32BE(this.pictureType, pos);
			pos += 4;

			const mimeTypeLen = Buffer.byteLength(this.mimeType);
			buffer.writeUInt32BE(mimeTypeLen, pos);
			buffer.write(this.mimeType, pos + 4);
			pos += 4 + mimeTypeLen;

			const descriptionLen = Buffer.byteLength(this.description);
			buffer.writeUInt32BE(descriptionLen, pos);
			buffer.write(this.description, pos + 4);
			pos += 4 + descriptionLen;

			buffer.writeUInt32BE(this.width, pos);
			buffer.writeUInt32BE(this.height, pos + 4);
			buffer.writeUInt32BE(this.bitsPerPixel, pos + 8);
			buffer.writeUInt32BE(this.colors, pos + 12);
			pos += 16;

			buffer.writeUInt32BE(this.pictureData.length, pos);
			this.pictureData.copy(buffer, pos + 4);
		}
		return buffer;
	}

	getSize() {
		let size = 4;
		size += 4 + Buffer.byteLength(this.mimeType);
		size += 4 + Buffer.byteLength(this.description);
		size += 16;
		size += 4 + (this.pictureData ? this.pictureData.length : 0);
		return size;
	}
}