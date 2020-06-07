const { loadOptions } = require('./database');
const { WatcherSystem } = require('./watcher');

const state = {
	options: loadOptions(),
	watchers: new WatcherSystem()
};

module.exports = {
	state
};
