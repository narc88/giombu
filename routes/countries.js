var CountryModel = require('../models/country').CountryModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var StateModel = require('../models/state').StateModel;
module.exports = function(app){
	app.get('/countries/initialize', function(req, res){
		CurrencyModel.findOne().exec(function(err,currency){
			CountryModel.remove().exec(function(err,country){
				console.log(franchisor.length)

				CountryModel.find().exec(function(err,country){
					console.log(franchisor.length)
				})
				CountryModel.remove({});
				var country = new CountryModel();
				country.name = 'Argentina'
				country.save(function(err){
					if(!err){
						console.log(country);
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var country = new CountryModel();
				country.name = 'Mexico'
				country.save(function(err){
					if(!err){
						console.log(country);
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var country = new CountryModel();
				country.name = 'Puerto Rico'
				country.save(function(err){
					if(!err){
						console.log(country);
					} else {
						console.log("Error: - " + err);
					}
				}); 

			})
			CountryModel.findOne({"name":"Argentina"}).exec(function(){

			})
	})
});
}