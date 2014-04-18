var CountryModel = require('../models/country').CountryModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var StateModel = require('../models/state').StateModel;
var CityModel = require('../models/city').CityModel;

module.exports = function(app){


	app.get('/states/:id:format(.json)?', function(req, res, next){
		StateModel.find({"country":req.params.id}).exec( function(err, states){
			if (err) throw err;
			if(states){
				res.send(states)
			}
		});
	});

}