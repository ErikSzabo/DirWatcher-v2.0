const winston = require('winston');
require('winston-daily-rotate-file');
const { resolve } = require('path');
const { state } = require('./state');

// Create a daily transport.
// This will create new log files every day.
// Log files that are older the 30 days will be removed.

const transport = new winston.transports.DailyRotateFile({
	filename: 'dirwatcher-%DATE%.log',
	dirname: resolve(__dirname, '../../logs'),
	datePattern: 'YYYY-MM-DD',
	maxFiles: '30d'
});

// This is the actual logger.
// Will only log if folderMonitoring option
// is enabled.

const logger = {
	logger: winston.createLogger({
		transports: [ transport ]
	}),

	info(msg) {
		if (state.options.folderMonitoring) {
			this.logger.info(msg);
		}
	},

	warn(msg) {
		if (state.options.folderMonitoring) {
			this.logger.warn(msg);
		}
	},

	error(msg) {
		if (state.options.folderMonitoring) {
			this.logger.error(msg);
		}
	}
};

module.exports.logger = logger;
