'use strict';

exports.authenticated = async (req, res, next) => {
	// console.log('## Middleware authenticated', req.originalUrl);
	if (req.session.hasOwnProperty('passport')) {
		req.session.isAuthenticated = req.session.passport.user !== undefined;
	} else {
		req.session.isAuthenticated = false;
	}
	res.locals.isAuthenticated = req.session.isAuthenticated;
	if (req.session.isAuthenticated) {
		res.locals.user = req.session.passport.user;
	}

    res.locals.fileversion = global.config.version;
	res.locals.host = global.config.host;
	if (req.protocol == 'https') res.locals.host = res.locals.host.replace('http://', 'https://');

	next();
};

exports.templateRoutes = (req, res, next) => {
	res.locals.routes = global.config.routes;
	next();
};

