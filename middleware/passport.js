'use strict';

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

let opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.jwtFromRequest = ExtractJwt.fromHeader('x-signature');
opts.secretOrKey = global.config.secret;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
	done(null, false);
}));

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

let routes = function routes(app) {

};

exports.passport = passport;
exports.routes = routes;
