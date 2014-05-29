var StateModel = require('../models/state').StateModel;
var CityModel = require('../models/city').CityModel;

module.exports = function(app){

	app.get('/states/:id:format(.json)?', function(req, res, next){
		StateModel.find({ country : req.params.id}).sort("-name").exec( function(err, states){
			if (err) throw err;
			res.json(states);
		});
	});


	app.get('/states/cities/:id:format(.json)?', function(req, res, next){
		CityModel.find({ state : req.params.id })
		.sort('-name')
		.exec(function(err, cities){
			if (err) throw err;
			res.json(cities);
		});
	});

}