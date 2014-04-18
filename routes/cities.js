var CountryModel = require('../models/country').CountryModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var StateModel = require('../models/state').StateModel;
var CityModel = require('../models/city').CityModel;

module.exports = function(app){
	//Este regex nos permite pedir la misma funcion como json, para usar donde necesitamos elegir quien nos invito y similar.
	app.get('/cities/:id:format(.json)?', function(req, res, next){
		CityModel.find({"state":req.params.id}).exec( function(err, cities){
			if (err) throw err;
			if(cities){
				res.send(cities)
			}
		});
	});
}