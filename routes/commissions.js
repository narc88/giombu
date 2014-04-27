var EventModel = require('../models/event').EventModel;

module.exports = function(app){

	app.on('sale', function (deal) {
	  console.log('someone bought!');
	});

}