var users = require('./users');
var promoters = require('./promoters');
var levels = require('./levels');
var errors = require('./errors');

var franchisors = require('./franchisors');
var franchises = require('./franchises');
var currencies = require('./currencies');

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

	// error handlers
	errors(app);




}


