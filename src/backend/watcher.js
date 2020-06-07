const { getRootFolder, getSubFolder, getSubFolders } = require('./database');
const fs = require('fs');

class Watcher {
	constructor(id) {
		this._id = id;
		this._watcher = null;
	}

	stop() {
		if (this._watcher !== null) {
			this._watcher.close();
		}
	}

	get id() {
		return this._id;
	}
}

class RootWatcher extends Watcher {
	constructor(id) {
		super();
	}

	async start() {
		const folder = await getRootFolder(this._id);
		this._watcher = fs.watch(folder.path, async () => {
			const subFolders = await getSubFolders(this._id);
			// TODO: sort new files and monitor changes if enabled
		});
	}
}

class SubWatcher extends Watcher {
	constructor(id) {
		super();
	}

	async start() {
		const folder = await getSubFolder(this._id);
		this._watcher = fs.watch(folder.path, () => {
			// TODO: monitor changes if enabled
		});
	}
}

const types = {
	ROOT: 0,
	SUB: 1
};

class WatcherSystem {
	constructor() {
		this._root = new Map();
		this._sub = new Map();
	}

	addWatcher(type, watcher) {
		if (type === types.ROOT) {
			this._root.set(watcher.id, watcher);
		} else if (type === types.SUB) {
			this._sub.set(watcher.id, watcher);
		}
	}

	startAll() {
		for (watcher of this._root.values) {
			watcher.start();
		}
		for (watcher of this._sub.values) {
			watcher.start();
		}
	}

	stopAll() {
		for (watcher of this._root.values) {
			watcher.stop();
		}
		for (watcher of this._sub.values) {
			watcher.stop();
		}
	}
}

module.exports = {
	RootWatcher,
	SubWatcher,
	WatcherSystem,
	types
};
