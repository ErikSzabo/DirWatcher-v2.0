const { loadOptions } = require('./database');
const { WatcherSystem } = require('./watcher');

module.exports.state = {
	options: loadOptions(),
	watchers: new WatcherSystem()
};
