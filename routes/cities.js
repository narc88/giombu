var CityModel = require('../models/city').CityModel;


module.exports = function(app){

	app.get('/cities/:id:format(.json)?', function(req, res, next){
		CityModel.find({ state : req.params.id }).sort("-name").exec(  function(err, cities){
			if (err) throw err;

			res.json(cities);
		});
	});
}