const { getRootFolder, getSubFolder, getSubFolders } = require('./database');
const fs = require('fs');
const fsp = require('./utils/fsPromises');

/**
 * Finds a subfolder which is responsible for
 * holding the specified extension. If none of the
 * subfolders meet the requirements, will return
 * undefined.
 * 
 * @param {*} extension 	file extension to look for
 * @param {*} subFolders 	array of subfolders
 */
function findSubFolder(extension, subFolders) {
	for (const subFolder of subFolders) {
		if (subFolder.extensions.includes(extension)) {
			return subFolder;
		}
	}
}

/**
 * "Abstract" class for watchers. Defines
 * the basic attributes and behaviors of the watchers.
 * 
 * Attributes
 * 	- _id: this should be identical with the database _id
 * 	- _watcher: this is an fs watcher, which will be watching
 * 				the directories.
 */
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
}

/**
 * Watcher class for Rootfolders.
 * Has a special start method, which will sort
 * new files in a root folder into its subfolders based on
 * the extension of the file.
 */
class RootWatcher extends Watcher {
	constructor(id) {
		super(id);
	}

	async start() {
		const { logger } = require('./logs');
		const folder = await getRootFolder(this._id);
		this._watcher = fs.watch(folder.path, async (event, filename) => {
			if (!await fsp.exists(folder.path + '\\' + filename)) return;
			const extension = filename.split('.').pop();
			const subFolder = findSubFolder(extension, await getSubFolders(this._id));

			logger.info(`[ROOT] FILE: ${filename}, moved into this root folder: ${folder.name}!`);

			if (!subFolder) return;

			try {
				await fsp.rename(folder.path + '\\' + filename, subFolder.path + '\\' + filename);
				logger.info(`[ROOT] FILE: ${filename} MOVED TO: ${subFolder.path} FROM: ${folder.path}`);
			} catch (e) {
				logger.error(`[ROOT] ${e.message}`);
			}
		});
	}
}

/**
 * Watcher class for Subfolders.
 * Has a special start method, which will
 * log new files and modifications in the
 * folder.
 */
class SubWatcher extends Watcher {
	constructor(id) {
		super(id);
	}

	async start() {
		const { logger } = require('./logs');
		const folder = await getSubFolder(this._id);
		this._watcher = fs.watch(folder.path, async (event, filename) => {
			if (event === 'rename') {
				if (await fsp.exists(folder.path + '\\' + filename)) {
					logger.info(`[SUB] FILE: ${filename}, moved into this sub folder: ${folder.name}!`);
				} else {
					logger.info(`[SUB] FILE: ${filename}, removed from this sub folder: ${folder.name}!`);
				}
			} else if (event == 'change') {
				logger.info(`[SUB] FILE: ${filename}, modified in this subfolder: ${folder.name}!`);
			}
		});
	}
}

/**
 * These types are userful when we trying to
 * add new watchers to the WatcherSystem.
 */
const types = {
	ROOT: 0,
	SUB: 1,
	ALL: 3
};

/**
 * This will store every root and sub watchers separated by each other.
 * addWatcher will store, and start newly added watchers, while
 * deleteWatcher will delete and stop the watchers.
 */
class WatcherSystem {
	constructor() {
		this._root = new Map();
		this._sub = new Map();
	}

	addWatcher(type, watcher) {
		if (type === types.ROOT) {
			this._root.set(watcher._id, watcher);
		} else if (type === types.SUB) {
			this._sub.set(watcher._id, watcher);
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

	startAll(type = types.ALL) {
		if (type === types.ROOT || type === types.ALL) {
			for (const watcher of this._root.values()) {
				watcher.start();
			}
		} else if (type === types.SUB || type === types.ALL) {
			for (const watcher of this._sub.values()) {
				watcher.start();
			}
		}
	}

	stopAll(type = types.ALL) {
		if (type === types.ROOT || type === types.ALL) {
			for (const watcher of this._root.values()) {
				watcher.stop();
			}
		} else if (type === types.SUB || type === types.ALL) {
			for (const watcher of this._sub.values()) {
				watcher.stop();
			}
		}
	}
}

module.exports = {
	RootWatcher,
	SubWatcher,
	WatcherSystem,
	types
};
