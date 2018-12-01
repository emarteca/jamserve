import {BaseController} from '../base/base.controller';
import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType} from '../../types';
import {JamRequest} from '../../api/jam/api';
import {RootStore, SearchQueryRoot} from './root.store';
import {RootService} from './root.service';
import {formatRoot} from './root.format';
import {StateStore} from '../state/state.store';
import {StateService} from '../state/state.service';
import {ImageService} from '../../engine/image/image.service';
import {DownloadService} from '../../engine/download/download.service';
import {Root} from './root.model';
import {User} from '../user/user.model';

export class RootController extends BaseController<JamParameters.ID, JamParameters.IDs, {}, SearchQueryRoot, JamParameters.RootSearch, Root, Jam.Root> {

	constructor(
		private rootStore: RootStore,
		private rootService: RootService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(rootStore, DBObjectType.root, stateService, imageService, downloadService);
	}

	async prepare(root: Root, includes: {}, user: User): Promise<Jam.Root> {
		return formatRoot(root, this.rootService.getRootStatus(root.id));
	}

	translateQuery(query: JamParameters.RootSearch, user: User): SearchQueryRoot {
		return {
			query: query.query,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async create(req: JamRequest<JamParameters.RootNew>): Promise<Jam.Root> {
		const root: Root = {
			id: '',
			created: Date.now(),
			type: DBObjectType.root,
			name: req.query.name,
			path: req.query.path
		};
		root.id = await this.rootService.createRoot(root);
		return this.prepare(root, {}, req.user);
	}

	async update(req: JamRequest<JamParameters.RootUpdate>): Promise<Jam.Root> {
		const root = await this.byID(req.query.id);
		root.name = req.query.name;
		root.path = req.query.path;
		await this.rootService.updateRoot(root);
		return this.prepare(root, {}, req.user);
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const root = await this.byID(req.query.id);
		await this.rootService.removeRoot(root);
	}

	async scanAll(req: JamRequest<{}>): Promise<void> {
		this.rootService.refresh(); // do not wait
	}

	async scan(req: JamRequest<JamParameters.ID>): Promise<void> {
		const root = await this.byID(req.query.id);
		this.rootService.refreshRoot(root); // do not wait
	}

	async status(req: JamRequest<JamParameters.ID>): Promise<Jam.RootStatus> {
		const root = await this.byID(req.query.id);
		return this.rootService.getRootStatus(root.id);
	}

}