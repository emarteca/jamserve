import {DBObjectType} from '../../db/db.types';
import {BaseStoreService} from '../base/base.service';
import {Radio} from './radio.model';
import {RadioStore, SearchQueryRadio} from './radio.store';

export class RadioService extends BaseStoreService<Radio, SearchQueryRadio> {

	constructor(public radioStore: RadioStore) {
		super(radioStore);
	}

	defaultSort(items: Array<Radio>): Array<Radio> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

	async create(name: string, url: string, homepageUrl?: string): Promise<Radio> {
		const radio: Radio = {
			id: '',
			type: DBObjectType.radio,
			name,
			homepage: homepageUrl,
			url,
			created: Date.now(),
			changed: Date.now()
		};
		radio.id = await this.radioStore.add(radio);
		return radio;
	}

	async update(radio: Radio, name?: string, url?: string, homepageUrl?: string): Promise<void> {
		radio.homepage = homepageUrl || radio.homepage;
		radio.url = url || radio.url;
		radio.name = name || radio.name;
		radio.changed = Date.now();
		await this.radioStore.replace(radio);
	}

	async remove(radio: Radio): Promise<void> {
		await this.radioStore.remove(radio.id);
	}
}
