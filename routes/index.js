var users = require('./users');
var promoters = require('./promoters');
var levels = require('./levels');
var deals = require('./deals');
var stores = require('./stores');
var errors = require('./errors');


var franchisors = require('./franchisors');
var franchises = require('./franchises');
var currencies = require('./currencies');
var countries = require('./countries');
module.exports = function(app){

	//Root
	app.get('/', function(req, res){
		res.render('index', { title: 'Giombu' });
	});

	users(app);
	promoters(app);
	levels(app);
	franchisors(app);
	franchises(app);
	currencies(app);
<<<<<<< HEAD
	countries(app);
=======
	deals(app);
	stores(app);
>>>>>>> upstream/pre-production

	// error handlers
	errors(app);

	//DEBUG!
	require('./debug')(app);

}


