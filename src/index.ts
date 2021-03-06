import program from 'commander';
import {Server} from './api/server';
import {loadConfig} from './config/config';
import {Database} from './db/db.model';
import {DBElastic} from './db/elasticsearch/db-elastic';
import {ElasticsearchConfig} from './db/elasticsearch/db-elastic.types';
import {DBNedb} from './db/nedb/db-nedb';
import {Engine} from './engine/engine';
import {Store} from './engine/store/store';
import {configureLogger, logger} from './utils/logger';
import {JAMSERVE_VERSION} from './version';

program
	.version(JAMSERVE_VERSION, '-v, --version')
	.usage('[options]')
	.option('-r, --reset', 'reset the db')
	.option('-c, --config <folder>', 'config file folder')
	.parse(process.argv);

const config = loadConfig(program.config);

configureLogger(config.log.level);
const log = logger('JamServe');

const db: Database =
	(config.database.use === 'elasticsearch') ?
		new DBElastic(config.database.options.elasticsearch as ElasticsearchConfig) :
		new DBNedb(config.getDataPath(['nedb']));
const store = new Store(db);
const engine = new Engine(config, store, JAMSERVE_VERSION);
const server = new Server(engine);

async function run(): Promise<void> {
	try {
		log.info(`Jamserve ${engine.version} starting`);
		await engine.start();
		await server.start();
		const version = await engine.settingsService.settingsVersion();
		const forceRescan = !!version && version !== engine.version;
		if (forceRescan) {
			log.info(`Updating from version ${version || '-'}`);
		}
		if (forceRescan || engine.settingsService.settings.library.scanAtStart) {
			engine.ioService.refresh(forceRescan).then(() => {
				return forceRescan ? engine.settingsService.saveSettings() : undefined;
			}).catch(e => {
				console.error('Error on startup scanning', e);
			});
		}
	} catch (e) {
		console.error('Error on startup', e);
		return;
	}
}

async function stop(): Promise<void> {
	try {
		await server.stop();
		await engine.stop();
		process.exit();
	} catch (e) {
		console.error('Error on server stop', e);
		process.exit(1);
	}
}

async function runClearDB(): Promise<void> {
	log.info(`Jamserve ${engine.version} cleaning DB`);
	await engine.store.open();
	await engine.store.reset();
	log.info(`Jamserve ${engine.version} removing cache files`);
	await engine.clearLocalFiles();
	await engine.store.close();
}

if (program.reset) {
	runClearDB().then(() => {
		console.log('done.');
	}).catch(e => {
		console.error(e);
	});
} else {

	process.on('SIGTERM', () => {
		stop().catch(e => {
			console.error(e);
		});
	});

	run().catch(e => {
		console.error(e);
	});
}
