var path = require('path');
var express = require('express');

module.exports = function(app){


	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, '../public')));
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'giombu-giombu-secret' }));
	app.use(express.bodyParser());

	// expose session to views
	app.use(function (req, res, next) {
		res.locals.session = req.session;
		next();
	});


	// development only
	if ('development' == app.get('env')) {
		app.use(express.errorHandler());
	}

}
