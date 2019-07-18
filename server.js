'use strict';
const config = require('./config/config');

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const flash = require('connect-flash');
const compression = require('compression');
const methodOverride = require('method-override');
const expressValidator = require('express-validator');
const cors = require('cors')
const app = express();

const errorHandlers = require('./middleware/errorhandlers');
const middleware = require('./middleware/utilities');
const passport = require('./middleware/passport');

app.use(compression());
app.use(cookieParser(global.config.secret));

const sessionStore = new redisStore({
	host: global.config.redisHost,
	port: global.config.redisPort,
	db: global.config.redisSelect,
	prefix: global.config.sessionName + ':',
	ttl: global.config.redisTTL
});

app.use(session({
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	name: global.config.sessionName,
	secret: global.config.secret,
	cookie: {
		httpOnly: true,
		secure: false,
		maxAge: global.config.sessionAge,
		expires: new Date(Date.now() + global.config.sessionAge),
		path: '/',
	}
}));

app.use(passport.passport.initialize());
app.use(passport.passport.session());
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(flash());
app.use(middleware.authenticated);
app.use(middleware.templateRoutes);
app.disable('x-powered-by');

const responseTime = require('./libs/response-time');
app.use(responseTime());

passport.routes(app);

app.use(cors())

// routes
require('./routes/route_api')(app);

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

global.config.port = process.env.PORT || global.config.port;

app.listen(global.config.port, () => {
	console.info('Config :', process.env.NODE_ENV);
	console.info('Host :', global.config.host);
	console.info('Listening on : ' + global.config.port);
});

const arrNum = [3, 5, 9, 15];
// const arrNum = [3, 5, 9, 15, 23, 33];
numberSeries(arrNum);

function numberSeries(arrNumber) {
	console.log('numberSeries => arrNumber', arrNumber);
	if (arrNumber.length >= 3) {
		let intDifficulty1, intDifficulty2, intDifficulty3, intLastNum, x, y, z = 0;
		for (let i = 0; i < arrNumber.length; i++) {
			if (i > 0) {
				intDifficulty1 = intDifficulty2;
				intDifficulty2 = arrNumber[i] - arrNumber[i - 1];
				intDifficulty3 = intDifficulty2 - intDifficulty1;
				intLastNum = arrNumber[i];
			}
		}
		x = intLastNum + (intDifficulty2 + intDifficulty3);
		y = x + (intDifficulty2 + intDifficulty3 + intDifficulty3);
		z = y + (intDifficulty2 + intDifficulty3 + intDifficulty3 + intDifficulty3);
		console.log('numberSeries => X=%s, Y=%s, Z=%s', x, y, z);
	} else {
		console.log('arrNumber.length < 3');
	}
}
