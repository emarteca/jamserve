import request from 'request';
import {CoverArtArchive} from '../../../model/coverartarchive-rest-data';
import {JSONOptions, JSONRequest, WebserviceJSONClient} from '../../../utils/webservice-json-client';

declare namespace CoverArtArchiveClientApi {
	export type Request = JSONRequest;
	export type Options = JSONOptions;
}

export class CoverArtArchiveClient extends WebserviceJSONClient<CoverArtArchiveClientApi.Request, CoverArtArchive.Response> {

	constructor(options: CoverArtArchiveClientApi.Options) {
		const defaultOptions = {
			host: 'https://coverartarchive.org',
			basePath: '/'
		};
		// https://musicbrainz.org/doc/Cover_Art_Archive/API#Rate_limiting_rules
		// there are currently no rate limiting rules in place at http://coverartarchive.org.
		// nevertheless, we limit this to 10 per second
		super(10, 1000, options.userAgent, {...defaultOptions, ...options});
	}

	protected async parseResult<T>(response: request.Response, body: any): Promise<T> {
		if (response.statusCode === 404) {
			return Promise.resolve({images: []} as any);
		}
		return super.parseResult<T>(response, body);
	}

	protected async processError(e: any, req: CoverArtArchiveClientApi.Request): Promise<CoverArtArchive.Response> {
		if (e instanceof SyntaxError) {
			// coverartarchive response may be code 200 with html on empty data
			// <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
			// <title>404 Not Found</title>
			// <h1>Not Found</h1>
			// <p>No cover art found for release {{mbid}}</p>
			// */
			return {images: []};
		}
		return super.processError(e, req);
	}

	async releaseImages(mbid: string): Promise<CoverArtArchive.Response> {
		const data = await this.get({
			path: `${this.options.basePath}release/${mbid}/`,
			query: {},
			retry: 0
		});
		return data;
	}

	async releaseGroupImages(mbid: string): Promise<CoverArtArchive.Response> {
		const data = await this.get({
			path: `${this.options.basePath}release-group/${mbid}/`,
			query: {},
			retry: 0
		});
		return data;
	}

}
