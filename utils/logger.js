const config = require('./../lib/config/config.json');

const {
	createLogger,
	format,
	transports
} = require('winston');

const {
	Timber
} = require('@timberio/node');

const {
	TimberTransport
} = require('@timberio/winston');

const loggerTransports = [
	new transports.Console({
		level: 'debug',
		format: format.combine(
			format.colorize(),
			format.timestamp({
				format: 'YYYY-MM-DD HH:mm:ss'
			}),
			format.printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`)
		)
	})
];

const timber = new Timber(config.TIMBER_API_KEY, config.TIMBER_ID);
loggerTransports.push(new TimberTransport(timber));

const logger = createLogger({
	level: 'debug',
	format: format.combine(
		format.colorize(),
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		format.printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`)
	),
	transports: loggerTransports
});

logger.verbose('Starting winston + timber logger...');

module.exports = logger;
