import {Engine} from './engine/engine';
import {configureLogger} from './utils/logger';
import {Server} from './api/server';
import {loadConfig} from './config';
import {Store} from './store/store';

const config = loadConfig();

configureLogger(config);
const engine = new Engine(config);
const server = new Server(engine);

async function run(): Promise<void> {
	try {
		await engine.start();
		await server.start();
	} catch (e) {
		console.error('Error on startup', e);
		return;
	}
	try {
		await engine.refresh();
	} catch (e) {
		console.error('Error on startup refresh', e);
	}
}

async function stop(): Promise<void> {
	try {
		await server.stop();
		await engine.stop();
		process.exit();
	} catch (e) {
		console.error('Error on startdown', e);
		process.exit(1);
	}
}

async function runClearDB(): Promise<void> {
	const store = new Store(config);
	await store.open();
	await store.reset();
	await store.close();
}

if (process.argv.indexOf('--cleardb') > 0) {
	runClearDB().then(() => {
		console.log('done.');
	}).catch(e => {
		console.error(e);
	});
} else {

	process.on('SIGTERM', () => {
		stop();
	});

	run();
}

