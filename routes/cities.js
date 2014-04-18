var CityModel = require('../models/city').CityModel;


module.exports = function(app){

	app.get('/cities/getCitiesForAState/:state_id', function(req, res, next){
		CityModel.find({ state : req.params.state_id }, function(err, cities){
			if (err) throw err;

			res.json(cities);
		});
	});

}