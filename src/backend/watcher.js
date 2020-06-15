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
		super(id);
	}

	async start() {
		const { state } = require('./state');
		const folder = await getRootFolder(this._id);
		this._watcher = fs.watch(folder.path, async (event, filename) => {
			if (!fs.existsSync(folder.path + '\\' + filename)) return;
			const subFolders = await getSubFolders(this._id);
			const extension = filename.split('.').pop();
			for (const subFolder of subFolders) {
				if (!subFolder.extensions.includes(extension)) {
					// TODO: log the new file
					continue;
				}
				fs.rename(folder.path + '\\' + filename, subFolder.path + '\\' + filename, (error) => {
					if (state.options.folderMonitoring) {
						if (error) {
							// TODO: log the error
							return;
						}
						// TODO: log the changes
					}
				});

				return;
			}
		});
	}
}

class SubWatcher extends Watcher {
	constructor(id) {
		super(id);
	}

	async start() {
		const { state } = require('./state');
		const folder = await getSubFolder(this._id);
		this._watcher = fs.watch(folder.path, (event, filename) => {
			if (!state.options.folderMonitoring) return;
			console.log('working');
			// TODO: log the changes
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
			watcher.start();
		} else if (type === types.SUB) {
			this._sub.set(watcher.id, watcher);
			watcher.start();
		}
	}

	async deleteWatcher(type, watcherID) {
		if (type === types.ROOT) {
			this._root.get(watcherID).stop();
			this._root.delete(watcherID);
			for (const subFolder of await getSubFolders(watcherID)) {
				this._sub.get(subFolder._id).stop();
				this._sub.delete(subFolder._id);
			}
		} else if (type === types.SUB) {
			this._sub.get(watcherID).stop();
			this._sub.delete(watcherID);
		}
	}

	startAll() {
		for (const watcher of this._root.values()) {
			watcher.start();
		}
		for (const watcher of this._sub.values()) {
			watcher.start();
		}
	}

	stopAll() {
		for (const watcher of this._root.values()) {
			watcher.stop();
		}
		for (const watcher of this._sub.values()) {
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
