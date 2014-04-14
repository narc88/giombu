var users = require('./users');
var promoters = require('./promoters');
var errors = require('./errors');

module.exports = function(app){

	//Root
	app.get('/', function(req, res){
		res.render('index', { title: 'Giombu' });
	});

	users(app);
	promoters(app);

	// error handlers
	errors(app);




}


