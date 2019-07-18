'use strict';

const Promise = require('bluebird');
const querystring = require("querystring");
const https = require("https");

// const GooglePlaces = require("googleplaces");
// const googlePlaces = new GooglePlaces(global.config.google.placesApiKey, global.config.google.placesOutputFormat);

const modelPlace = {
	getGooglePlace: (parameters) => {
		console.log('### Model modelPlace.getGooglePlace');
		return new Promise((resolve, reject) => {
			const outputFormat = global.config.google.placesOutputFormat;
			parameters.key = global.config.google.placesApiKey;
			if (parameters.query) parameters.query = parameters.query;
			else delete parameters.query;
			if (parameters.pagetoken) parameters.pagetoken = parameters.pagetoken;
			else delete parameters.pagetoken;
			parameters.sensor = parameters.sensor || false;
			parameters._ = (new Date()).getTime().toString(36);
			const url = "https://maps.googleapis.com/maps/api/place/textsearch/" + outputFormat + "?" + querystring.stringify(parameters);
			https.get(url, (response) => {
				let responseData = "";
				response.setEncoding("utf8");
				response.on("data", function (chunk) {
					responseData += chunk;
				});
				response.on("end", function () {
					try {
						responseData = JSON.parse(responseData);
						console.log('responseData.status', responseData.status);
						if (responseData.status !== 'OK' && responseData.status !== 'OVER_QUERY_LIMIT') {
							let error = new Error(responseData.error_message || responseData.status);
							error.name = responseData.status;
							throw error;
						}
					} catch (e) {
						return reject(e);
					}
					return resolve(responseData);
				});

			}).on('error', function (e) {
				console.log("Got error: " + e.message);
				return reject(e);
			});

		});
	},
};

module.exports = modelPlace;
