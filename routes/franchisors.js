var FranchisorModel = require('../models/franchisor').FranchisorModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
module.exports = function(app){
	app.get('/franchisors/initialize', function(req, res){
		CurrencyModel.findOne().exec(function(err,currency){
			FranchisorModel.remove().exec(function(err,franchisor){
				console.log(franchisor.length)

				FranchisorModel.find().exec(function(err,franchisor){
					console.log(franchisor.length)
				})
				FranchisorModel.remove({});
				var franchisor = new FranchisorModel();
				franchisor.name = 'Argentina'
				franchisor.cctdl = "ar"
				franchisor.default_timezone = -3
				franchisor.currency =currency._id
				franchisor.save(function(err){
					if(!err){
						console.log(franchisor);
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var franchisor = new FranchisorModel();
				franchisor.name = 'Mexico'
				franchisor.cctdl = "mx"
				franchisor.default_timezone = -6
				franchisor.save(function(err){
					if(!err){
						console.log(franchisor);
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var franchisor = new FranchisorModel();
				franchisor.name = 'Puerto Rico'
				franchisor.cctdl = "pr"
				franchisor.default_timezone = -4
				franchisor.save(function(err){
					if(!err){
						console.log(franchisor);
					} else {
						console.log("Error: - " + err);
					}
				}); 

			})
	})
});
}