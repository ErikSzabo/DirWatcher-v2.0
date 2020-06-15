const { loadOptions } = require('./database');
const { WatcherSystem } = require('./watcher');

const stateManager = {
	state: {
		options: loadOptions(),
		watchers: new WatcherSystem()
	}
};

module.exports = {
	state: stateManager.state
};
