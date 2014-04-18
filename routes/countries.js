var CountryModel = require('../models/country').CountryModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var StateModel = require('../models/state').StateModel;
var CityModel = require('../models/city').CityModel;

module.exports = function(app){




	//Este regex nos permite pedir la misma funcion como json, para usar donde necesitamos elegir quien nos invito y similar.
	app.get('/countries.json', function(req, res, next){
		CountryModel.findById.exec( function(err, country){
			if (err) throw err;
			if(req.params.format){
				usernames = [];
				for (var i = countries.length - 1; i >= 0; i--) {
					countries.push(countries[i].name)
				};
				res.send(usernames)
			}
		});
	});

	app.get('/countries/initialize', function(req, res){
		CurrencyModel.findOne().exec(function(err,currency){
			CountryModel.remove().exec(function(err,country){
				console.log(country.length)

				CountryModel.find().exec(function(err,country){
					console.log(country.length)
				})
				CountryModel.remove({});
				var country = new CountryModel();
				country.name = 'Argentina'
				country.save(function(err){
					if(!err){
						console.log(country);
						CountryModel.findOne({"name":"Argentina"}).exec(function(err,country){
						var state = new StateModel();
						state.name = 'Entre Rios'
						state.country = country._id
						state.save(function(err){
							if(!err){
								StateModel.findOne({"name":"Entre Rios"}).exec(function(err,state_found){
									var city = new CityModel();
									city.name = 'Parana'
									city.state = state_found._id
									city.save(function(err){
										if(!err){
											console.log(city);
										} else {
											console.log("Error: - " + err);
										}
									});
								});
							} else {
								
							}
						});
						var state = new StateModel();
						state.name = 'Santa Fe'
						state.country = country._id
						state.save(function(err){
							if(!err){
								console.log(state);
							} else {
								console.log("Error: - " + err);
							}
						}); 
						var state = new StateModel();
						state.name = 'Buenos Aires'
						state.country = country._id
						state.save(function(err){
							if(!err){
								console.log(state);
							} else {
								console.log("Error: - " + err);
							}
						}); 
						var state = new StateModel();
						state.name = 'Cordoba'
						state.country = country._id
						state.save(function(err){
							if(!err){
								console.log(state);
							} else {
								console.log("Error: - " + err);
							}
						}); 
						var state = new StateModel();
						state.name = 'Mendoza'
						state.country = country._id
						state.save(function(err){
							if(!err){
								console.log(state);
							} else {
								console.log("Error: - " + err);
							}
						}); 
						var state = new StateModel();
						state.name = 'Corrientes'
						state.country = country._id
						state.save(function(err){
							if(!err){
								console.log(state);
							} else {
								console.log("Error: - " + err);
							}
						});  
					})
					} else {
						console.log("Error: - " + err);
					}
				}); 
				
				var country = new CountryModel();
				country.name = 'Mexico'
				country.save(function(err){
					if(!err){
						console.log(country);
						CountryModel.findOne({"name":"Mexico"}).exec(function(err,country){
							var state = new StateModel();
							state.name = 'Df'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							});
							var state = new StateModel();
							state.name = 'Guadalajara'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							}); 
							var state = new StateModel();
							state.name = 'Morelia'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							}); 
							var state = new StateModel();
							state.name = 'Acapulco'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							}); 
						})
					} else {
						console.log("Error: - " + err);
					}
				}); 
				var country = new CountryModel();
				country.name = 'Puerto Rico'
				country.save(function(err){
					if(!err){
						console.log(country);
						CountryModel.findOne({"name":"Puerto Rico"}).exec(function(err,country){
							var state = new StateModel();
							state.name = 'San Jose'
							state.country = country._id
							state.save(function(err){
								if(!err){
									console.log(state);
								} else {
									console.log("Error: - " + err);
								}
							});
						})
					} else {
						console.log("Error: - " + err);
					}
				}); 

			})
			CountryModel.findOne({"name":"Argentina"}).exec(function(){

			})
			res.send("OK")
	})
});
}