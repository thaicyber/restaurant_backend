'use strict';
try {
	const dotenv = require('dotenv').config();
	console.info('config:', process.env.NODE_ENV);
	let config = {
		domain: 'localhost',
		host: 'http://localhost:5010',
		port: 5010,
		sessionName: 'scg-backend',
		sessionAge: 1000 * 60 * 60 * 24 * 31,
		secret: process.env.RD_SECRET ? process.env.RD_SECRET : 'express@scg',
		redisHost: process.env.RD_HOST ? process.env.RD_HOST : 'localhost',
		redisPort: process.env.RD_PORT ? process.env.RD_PORT : 6379,
		redisSelect: process.env.RD_SELECT ? process.env.RD_SELECT : 1,
		redisTTL: 60 * 60 * 24 * 31,
		redisTokenName: process.env.RD_TOKEN ? process.env.RD_TOKEN : 'scg-token',
		google: {
			placesApiKey: null,
			placesOutputFormat: 'json'
		},
		routes: {},
	};
	if (process.env.NODE_ENV == 'development') {
		config.domain = 'localhost';
		config.host = 'http://localhost:5010';
		config.port = 5010;
		config.redisHost = process.env.RD_HOST ? process.env.RD_HOST : 'localhost';
		config.redisPort = process.env.RD_PORT ? process.env.RD_PORT : 6379;
		config.redisSelect = process.env.RD_SELECT ? process.env.RD_SELECT : 1;
		config.google.placesApiKey = '';
	} else {
		console.log(`########## Error :: NODE_ENV='${process.env.NODE_ENV}' No config value! ##########`);
		process.exit(1);
	}

	config.routes = require('./config.routes');
	global.config = config;
	module.exports = config;

} catch (error) {
	console.error(`########## Error :: Load config! ##########`, error);
	process.exit(1);
}
