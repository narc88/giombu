
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var private_config = require('./private_config');

mongoose.set('debug', true);

mongoose.connect("mongodb://giombu:giombu@oceanic.mongohq.com:10021/giombu", function(err){
	if(err) throw err;
	var app = express();
	require('./middleware')(app);
	require('./routes')(app);
	
	http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
});
