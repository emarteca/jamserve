import {RootScanStrategy} from '../../model/jam-types';
import {DBObject} from '../base/base.model';

export interface Root extends DBObject {
	name: string;
	path: string;
	created: number;
	strategy: RootScanStrategy;
}

export interface RootStatus {
	lastScan: number;
	scanning?: boolean;
	error?: string;
}
