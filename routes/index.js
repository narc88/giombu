var users = require('./users');
var errors = require('./errors');

module.exports = function(app){

	//Root
	app.get('/', function(req, res){
		res.render('index', { title: 'Giombu' });
	});

	users(app);

	// error handlers
	errors(app);




}


