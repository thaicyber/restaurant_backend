const middleware = require('../middleware/utilities');
const apiSCG = require('../controllers/controller_scg');

module.exports = function (app) {
	app.get(global.config.routes.apiIndex,  apiSCG.jsonIndexGet);
	app.get(global.config.routes.apiSCG,  apiSCG.jsonPlaceGet);
};
