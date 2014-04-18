var users = require('./users');
var promoters = require('./promoters');
var levels = require('./levels');
var deals = require('./deals');
var stores = require('./stores');
var franchisors = require('./franchisors');
var franchises = require('./franchises');
var currencies = require('./currencies');
var countries = require('./countries');
var cities = require('./cities');
var states = require('./states');
var images = require('./images');
var states = require('./states');
var cities = require('./cities');

var errors = require('./errors');

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
	countries(app);
	deals(app);
	stores(app);
	images(app);
	states(app);
	cities(app);
<<<<<<< HEAD
=======

>>>>>>> upstream/pre-production

	// error handlers
	errors(app);

	//DEBUG!
	require('./debug')(app);

}


