var path = require('path');
var express = require('express');
var SessionSockets = require('session.socket.io');
var sessionSockets;

module.exports = function(app, io){

	var secret_sauce = 'this_is_my_secret_sauce';
	var sessionStore = new express.session.MemoryStore();
	var cookieParser = express.cookieParser(secret_sauce);

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, '../public')));
	app.set('photos',path.join(__dirname,'../public/photos/'));
	app.use(cookieParser);
	app.use(express.session({
		store :  sessionStore 
	}));
	app.use(express.bodyParser());
	// expose session to views
	app.use(function (req, res, next) {
		if(typeof req.session.expose === 'undefined'){
			req.session.expose = {};
		}
		res.locals.expose = req.session.expose;
		next();
	});


	// development only
	if ('development' == app.get('env')) {
		app.use(express.errorHandler());
	}


	//Socket IO
	sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
	sessionSockets.on('connection', require('../socket'));

}
