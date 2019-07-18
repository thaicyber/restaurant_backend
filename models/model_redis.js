'use strict';

const Promise = require('bluebird');
const crypto = require('crypto');
const dbRedis = require("../config/dbRedis");

const modelRedis = {
	allSetDataByObj: function (name, objData, timeout) {
		// console.log('### Model modelRedis.allSetDataByObj', name);
		return new Promise(function (resolve, reject) {
			let strObj = JSON.stringify(objData);
			if (process.env.NODE_ENV == 'production') {
				if (timeout === undefined) timeout = 60 * 5; // 5 min
			} else {
				if (timeout === undefined) timeout = 60; // 1 min
			}
			let hash = crypto.createHash('sha224').update(name).digest('hex');
			let key = global.config.redisTokenName + '-cache:' + hash;
			dbRedis.setex(key, timeout, strObj);
			resolve(true);
		});
	},
	allGetDataByObj: function (name) {
		// console.log('### Model modelRedis.allGetDataByObj', name);
		return new Promise(function (resolve, reject) {
			let hash = crypto.createHash('sha224').update(name).digest('hex');
			let key = global.config.redisTokenName + '-cache:' + hash;
			dbRedis.get(key, function (err, _data) {
				if (_data) {
					let objData = JSON.parse(_data);
					resolve(objData);
				} else {
					resolve(false);
				}
			});
		});
	},
};

module.exports = modelRedis;
