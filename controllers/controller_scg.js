'use strict';
const modelPlace = require('../models/model_place');
const modelRedis = require('../models/model_redis');

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const apiSCG = {
	jsonIndexGet: async (req, res) => {
		console.log('# Controller apiSCG.jsonIndexGet');
		let resData = {
			code: 1,
			msg: null,
			data: {}
		};
		resData.msg = 'Hello SCG';
		resData.code = 0;
		return res.json(resData);
	},
	jsonPlaceGet: async (req, res) => {
		console.log('# Controller apiSCG.jsonPlaceGet');
		let resData = {
			code: 1,
			msg: null,
			data: {}
		};
		try {
			let cachePlace = await modelRedis.allGetDataByObj('restaurants in Bangsue');
			if (!cachePlace) {
				resData.code = 0;
				let fetchPlaces = [];
				let loopWhile = true;
				let parameters = { query: "restaurants in Bangsue" };
				while (loopWhile) {
					const fetchPlace = await modelPlace.getGooglePlace(parameters);
					if (fetchPlace.results) {
						for (const result of fetchPlace.results) {
							if (result) fetchPlaces.push(result);
						}
					}
					if (fetchPlace.status) resData.msg = fetchPlace.status;
					if (fetchPlace.next_page_token) {
						parameters = { pagetoken: fetchPlace.next_page_token };
					} else {
						loopWhile = false;
					}
					if (loopWhile) await timeout(3000);
				}
				resData.data = fetchPlaces;
				cachePlace = {
					msg: resData.msg,
					data: resData.data
				};
				modelRedis.allSetDataByObj('restaurants in Bangsue', cachePlace, 60 * 60 * 24)
			} else {
				resData.msg = cachePlace.msg;
				resData.data = cachePlace.data;
			}
			return res.json(resData);
		} catch (error) {
			console.error('# Error Controller apiSCG.jsonPlaceGet', error);
			resData.msg = error;
			return res.json(resData);
		}
	},
};

module.exports = apiSCG;
