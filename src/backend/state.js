const { loadOptions } = require('./database');
const { WatcherSystem } = require('./watcher');

const options = loadOptions();

/**
 * Application state.
 */
module.exports.state = {
	options: options,
	watchers: new WatcherSystem(),
	watch: {
		root: options.autoWatchRoot,
		sub: options.autoWatchSub
	}
};
