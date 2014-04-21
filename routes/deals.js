var DealModel = require('../models/deal').DealModel;
var QuestionModel = require('../models/question').QuestionModel;
var StoreModel = require('../models/store').StoreModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var Franchisor = require('./franchisors');
var FranchisorModel = require('../models/franchisor').FranchisorModel;
var FranchiseModel = require('../models/franchise').FranchiseModel;
var colors = require('colors');
var util = require('../helpers/util');
var mongoose = require('mongoose');
var CheckAuth = require('../middleware/checkAuth');
//Logging system
// var logentries = require('node-logentries');
// var log = logentries.logger({
//   token:'4ac8c7db-6c93-48a8-a250-77bd6e744a9d'
// });



module.exports = function (app){


	//Llama a la vista de creacion de una nueva deal
	app.get('/deals/create', CheckAuth.user, CheckAuth.seller, function (req, res, next) {
		console.log('deals - create'.cyan.bold);
		FranchisorModel.findById( req.session.user.franchisor , function(err, franchisor){

			if (err) throw err;

			FranchiseModel.find( {"franchisor" : franchisor._id } , function(err, franchises){

				if (err) throw err;

				if(franchises.length > 0){
					StoreModel.find( {franchisor : franchisor._id } , function(err, stores){
					
						res.render('deals/create', {
							title: 'Cargar Oferta',
							user 		: req.session.user,
							stores 		: stores,
							franchisor 	: franchisor,
							franchises 	: franchises
						});

					});
				}else{
					throw new Error('No hay franquicias en el pais del usuario');
				}

			});

	  	});
	});


	//Agrega una nueva deal
	app.post('/deals/add', function (req, res, next) {


		//USAR req.body en lugar de req.param()
		// console.log('Deals ADD');
		// console.log(req.body);

		var deal_new = req.param('deal');
		deal_new.sale_count = 0; 		//Yo no lo pondria
		deal_new.coupon_count = 0;
		//Validar los ids de los siguientes datos
		//Crear correctamente los dates en base a los valores ingresados
		//FECHAS
		deal_new.franchises = req.param('franchises');
		deal_new.tagline = req.param('deal').tagline.split(",");
		//Armo la fecha de inicio
		deal_new.start_date = util.date_mongo(deal_new.start_date, deal_new.start_time);
		//Armo la fecha de fin
		deal_new.end_date = util.date_mongo(deal_new.end_date, deal_new.end_time);
		//Armo la fecha de inicio de canje
		deal_new.start_redeem = util.date_mongo(deal_new.start_redeem, "00:00");
		//Armo la fecha de fin de canje
		deal_new.end_redeem = util.date_mongo(deal_new.end_redeem, "00:00");
		
		//Quito las horas ya que no pertenecen al modelo
		delete deal_new.start_time;
		delete deal_new.end_time;
	/*
		deal_new.store = '';
		deal_new.seller = '';
		deal_new.franchisor = '';
		deal_new.franchise = '';
		deal_new.currency = '';
		deal_new.images = '';
	*/
		//Genero la nueva deal a partir de la coleccion que arme
		var deal = new DealModel(deal_new);

		deal.save(function (err) {

			if (err) throw err;

			res.redirect('/intranet/deals/view/' + deal._id);

		});

	});


	//Muestra deals activos.
	app.get('/deals/home', function(req, res, next){
		if(req.session.user){
			if(req.session.user.selected_franchise){
				DealModel.find( {} ).limit(10).where('franchises').in([req.session.user.selected_franchise._id]).sort("-created")
				.exec(function (err, deals) {
					
					  if (err) return handleError(err);
					if(deals){
						console.log('Filtrando');
						var messagge = req.session.messagge;
						delete req.session.messagge
					  res.render('deals/home', {title: 'Ofertas', user:req.session.user, deals:deals, messagge:messagge});
					}else{
					  res.render('not_found', {title: 'Oferta no encontrada', user: req.session.user});
					}
				});
			}else{
				DealModel.find( {} ).limit(10).sort("-created")
					.exec(function (err, deals) {
						if (err) return handleError(err);
						if(deals){
							console.log('Sin franquicia'+deals.length);
							var messagge = req.session.messagge;
							delete req.session.messagge
						  res.render('deals/home', {title: 'Ofertas', user:req.session.user, deals:deals, messagge:messagge});
						}else{
						  res.render('not_found', {title: 'Oferta no encontrada', user: req.session.user});
						}
					});
			}
		}else{
			DealModel.find().limit(10).sort("-created")
			.exec(function (err, deals) {
				 if (err) return handleError(err);
				if(deals){		
					console.log('Deslogueado'+deals.length);
					var messagge = req.session.messagge;
					delete req.session.messagge
				  res.render('deals/home', {title: 'Ofertas', user:req.session.user, deals:deals, messagge:messagge});
				}else{
				  res.render('not_found', {title: 'Oferta no encontrada', user: req.session.user});
				}
			});
		}
	});


	//Muestra la vista detallada de una deal en particular
	app.get('/intranet/deals/view/:id', function(req, res, next){
		DealModel.findById( req.params.id ).populate('franchises').populate('store').exec( function(err, deal){
			if(!err){
				if(deal){
					console.log(deal);
					res.render('deals/view', {title: 'Oferta', user: req.session.user, deal : deal});
				}else{
					console.log('deals - view - No se encontro el deal ( ' + req.body.deal_id +' )');
					res.render('not_found', {title: 'Oferta', user: req.session.user});
				}
			}else{
				console.log('deals - view - '.red.bold + err);
				res.render('not_found', {title: 'Oferta', user: req.session.user});
			}
	  });
	});


	//Muestra la vista detallada de una deal en particular
	app.get('/deals/view/:id', function(req, res, next){
		DealModel.findById( req.params.id ).populate('franchises').populate('store').sort("-created").exec( function(err, deal){
			if(!err){
				if(deal){
					console.log(deal);
					DealModel.find().nor([{ "_id":req.params.id}]).populate('franchises').populate('store').exec( function(err, deals){
						if(!err){
							if(deals){
								QuestionModel.find({'deal':deal._id}).populate('user').populate('deal').exec( function(err, questions){
									if(!err){
					
									console.log(deals.length)
									res.render('deals/show', {title: 'Oferta', user: req.session.user, deal : deal, deals:deals, questions:questions});
									}
							});
							}
						}
					});
				}else{
					console.log('deals - view - No se encontro el deal ( ' + req.body.deal_id +' )');
					res.render('not_found', {title: 'Oferta', user: req.session.user});
				}
			}else{
				console.log('deals - view - '.red.bold + err);
				res.render('not_found', {title: 'Oferta', user: req.session.user});
			}
	  });
	});


	app.get('/intranet/deals/erase_image/:id/:image_id', function (req, res, next) {
	    DealModel.update({_id: req.params.id}, 
	        {$pull: {images: {_id: req.params.image_id}}}, {upsert: true}, function(err, deal){
	        	console.log(err);
	        	res.redirect('/intranet/deals/view/' + req.params.id);
	        }
	    );
	});


	app.get('/intranet/deals/set_as_principal/:id/:image_id', function (req, res, next) {
		DealModel.findOne().where('_id').equals(req.params.id).exec(function (err, deal) {
	 	 if(!err){
				if(deal){
					console.log(deal.discount);
					for (var i = deal.images.length - 1; i >= 0; i--) {
						if(deal.images[i]._id == req.params.image_id){
							deal.images[i].default = true;
						}else{
							deal.images[i].default = false;
						}
					};
					deal.save(function (err) {});
				}else{
					console.log('deals - view - No se encontro el deal ( ' + req.body.deal_id +' )');
				}
			}else{
				console.log('deals - view - '.red.bold + err);
			}
		});
		DealModel.update({_id:req.params.id,'images._id':req.params.image_id},{$set:{'images.$.default':true}},{upsert: true}, function(err){        	
			res.redirect('/intranet/deals/view/' + req.params.id);
		});

	});



	//No se que hace esto?
	exports.review = function(req, res, next){
		DealModel.findById( req.params.id , function(err, deal){
			if(!err){
				if(deal){
					console.log('deals - view - Se encontro el deal ( ' + req.params.id +' )');
					res.render('deals/review', {title: 'Deal', user: req.session.user,deal : deal});
				}else{
					console.log('deals - view - No se encontro el deal ( ' + req.body.deal_id +' )');
				}
			}else{
				console.log('deals - view - '.red.bold + err);
			}
	  });
	}


	//Lista las deals
	app.get('/intranet/deals/list', function(req, res, next){
		if(req.session.user.franchise_selected){
			DealModel.find( {} ).where('franchises').in([req.session.user.franchise_selected._id]).sort("-created").exec(function(err, deals){
				if(!err){
					if(deals.count != 0){
						console.log(deals.count+"count")
						console.log('deal - list - Se envian los deals encontrados');
						res.render('deals/list', {title: 'Lista de deals', user: req.session.user,  deals : deals});
					}else{
						console.log('deal - list - No hay deals');
						res.render('not_found', {title: 'Oferta', user: req.session.user});
					}
				}else{
					console.log('deal - list - '.red.bold + err);
				}
		  	});
		}else{
			DealModel.find( {} ).sort("-created").exec(function(err, deals){
				if(!err){
					if(deals.count != 0){
						console.log(deals.count+"count")
						console.log('deal - list - Se envian los deals encontrados');
						res.render('deals/list', {title: 'Lista de deals', user: req.session.user,  deals : deals});
					}else{
						console.log('deal - list - No hay deals');
						res.render('not_found', {title: 'Oferta', user: req.session.user});
					}
				}else{
					console.log('deal - list - '.red.bold + err);
				}
		  	});
		}
	});

	//Lista las deals
	app.get('/deals/travel', function(req, res, next){
		
			DealModel.find( { 'tagline': { $in: ['viajes', 'viaje']}} ).sort("-created").exec(function(err, deals){
				if(!err){
					if(deals.count != 0){
						console.log(deals.count+"count")
						console.log('deal - list - Se envian los deals encontrados');
						res.render('deals/home', {title: 'Lista de deals', user: req.session.user,  deals : deals});
					}else{
						console.log('deal - list - No hay deals');
						res.render('not_found', {title: 'Oferta', user: req.session.user});
					}
				}else{
					console.log('deal - list - '.red.bold + err);
				}
		  	});
		
	});


	//Llama a la vista de edicion de una deal
	app.get('/intranet/deals/edit/:deal_id', function(req, res, next){
		DealModel.findById( req.params.deal_id, function(err, deal){
			if(!err){
				if(deal){
					console.log(deal)
					console.log('deal - edit - deal encontrado, redirecciono a deal/edit');
					//Acomodo las fechas y horas para que sean humanamente visibles
					//estos campos deben ser eliminados antes de realizar el update
					deal.start_time = util.time_string(deal.start_date);
					deal.end_time = util.time_string(deal.end_date);
					deal.start_date_string = util.date_string(deal.start_date);
					deal.end_date_string = util.date_string(deal.end_date);
					deal.start_redeem_string = util.date_string(deal.start_redeem);
					deal.end_redeem_string = util.date_string(deal.end_redeem);
					res.render('deals/edit', {title: 'deal Edit', user: req.session.user, deal : deal});
				}else{
					console.log('deal - edit - No se encontro el deal ( ' + req.params.deal_id +' )');
				}
			}else{
				console.log('deal - edit - '.red.bold + err);
				res.redirect('/');
			}
		});	
	});



	//Actualiza los campos de la deal
	app.post('/deals/update', function(req, res, next){

		console.log('deal - update'.cyan.bold);
		console.log('deal - update - Busco el deal ( ' + req.body.deal_id +' )');

		DealModel.findById( req.body.deal_id , function(err, deal){
			if(!err){
				if(deal){
					console.log('deal - update - Se encontro el deal ( ' + req.body.deal_id +' )');
					
					//Edicion del deal
					//Hacer que solo se graben los campos editados
					edited_deal = req.param('deal');
					console.log(edited_deal);
					console.log("editado")
					//Tomo los datos del front-end y los formateo en los campos de formato date correspondiente
					//luego elemino los campos que no son necesario y actualizo la deal
					edited_deal.start_date = util.date_mongo(edited_deal.start_date_string, edited_deal.start_time);
					delete edited_deal.start_date_string;
					delete edited_deal.start_time;

					edited_deal.end_date = util.date_mongo(edited_deal.end_date_string, edited_deal.end_time);
					delete edited_deal.end_date_string;
					delete edited_deal.end_time;

					edited_deal.start_redeem = util.date_mongo(edited_deal.start_redeem_string, '00:00');
					delete edited_deal.start_redeem_string;

					edited_deal.end_redeem = util.date_mongo(edited_deal.end_redeem_string, '00:00');
					delete edited_deal.end_redeem_string;


					for (field in edited_deal){
						if(edited_deal[field] != ''){
							deal[field] = edited_deal[field];
							console.log('deal - update - Edito el campo '+ field);
						}
					}

					deal.update(function (err) {
						if (!err) {
							console.log('deal - update - Guardo una nueva deal');
							console.log('deal - update - Redirecciono a deal/create');
							res.render('deals/view', {title: 'deal View', user : req.session.user, deal : deal});
						} else {
							console.log('deal - update - '.red.bold + err);
							console.log('deal - update - Redirecciono a /');
							res.redirect('/');
						}

					});



				}else{
					console.log('deal - edit - No se encontro el deal ( ' + req.body.deal_id +' )');
				}
			}else{
				console.log('deal - edit - '.red.bold + err);
			}

	  });

	});



	//Elimina una deal
	app.get('/deals/remove/:deal_id', function(req, res, next){

		console.log('deals - remove'.cyan.bold);
		console.log('deals - remove - Busco el deal ( ' + req.params.deal_id +' )');

		DealModel.findById( req.body.deal_id , function(err, deal){
			if(!err){
				if(deal){
					console.log('deals - remove - Se encontro el deal ( ' + req.params.deal_id +' )');
					//Elimino el deal
					deal.remove(function(err){
						if(!err){
							console.log('deals - remove - Se elimina el deal ( ' + req.params.deal_id +' )');
							res.redirect('/');
						}else{
							console.log('deals - remove - '.red.bold + err);
							res.redirect('/deals/list');
						}
					})
				}else{
					console.log('deals - remove - No se encontro el deal ( ' + req.params.deal_id +' )');
					res.redirect('/deals/list');
				}
			}else{
				console.log('deals - remove - '.red.bold + err);
				res.redirect('/');
			}
	  });

	});


	//Arma el menu de admin y redirecciona
	app.get('/intranet/deals/admin', function(req, res, next){
		res.render('deals/admin', {
			title : 'Lista de deals activos',
			user: req.session.user
		});

	});





}




//Estadisticas para ofertas

function map_by_day() {
	emit((this.created.getMonth()+1).toString()+this.created.getDate().toString()+this.created.getFullYear().toString() , 1);
}

function reduce_count(key, values) {
	var res = 0
	values.forEach(function (v) {
		res = res + 1 
	});
	return res;
}

exports.calculate_new_deals = function(req, res, next){
	mongoose.connection.db.executeDbCommand({mapreduce: "deals", map: map_by_day.toString(), reduce: reduce_count.toString(), out: {inline: 1}}, 
		function(err, deals){
			if(!err){
				console.log(deals.documents[0].results)
				if(!deals){
					console.log('No se han encontrado coincidencias')
				}else{
					res.writeHead(200, { 'Content-Type': 'application/json' });   
					res.write(JSON.stringify(deals.documents[0].results));
					res.end();
				}
			}else{
				if (err) throw err;
			}
		});
}


//Estadisticas


function map_by_day() {
	emit((this.created.getMonth()+1).toString() , 1);
}

function reduce_count(key, values) {
	var res = 0
	values.forEach(function (v) {
		res = res + 1 
	});
	return res;
}

exports.calculate_new_deals = function(req, res, next){
	var today = new Date();
	var year;
	var month;
	if(today.getMonth()>=5){
		year = today.getFullYear();
		month = today.getMonth()-5;
	}else{
		year = today.getFullYear()-1;
		month = today.getMonth()-5+12;
	}
	mongoose.connection.db.executeDbCommand({mapreduce: "deals", map: map_by_day.toString(), reduce: reduce_count.toString(), out: {inline: 1}, query: {created: {$gt: new Date(year, month, 1)}}},
		function(err, deals){
			if(!err){
				console.log(deals.documents[0].results)
				if(!deals){
					console.log('No se han encontrado coincidencias')
				}else{
					res.writeHead(200, { 'Content-Type': 'application/json' });   
					res.write(JSON.stringify(deals.documents[0].results));
					res.end();
				}
			}else{
				if (err) throw err;
			}
		});
}


// Totales vendidos por mes.

function map_sales_total_by_month() {
	var total = 0  
	for (var idx = 0; idx < this.sales.length; idx++) {
		total= total + this.sales[idx].coupons.length;
	}
	var amount = total * this.special_price
	emit((this.created.getMonth()+1).toString() , amount);
}

function reduce_count_total_by_month(key, values) {
	var res = 0
	values.forEach(function (v) {
		res = res + v
	});
	return res;
}

exports.calculate_total_by_month = function(req, res, next){
	var today = new Date();
	var year;
	var month;
	if(today.getMonth()>=5){
		year = today.getFullYear();
		month = today.getMonth()-5;
	}else{
		year = today.getFullYear()-1;
		month = today.getMonth()-5+12;
	}
	mongoose.connection.db.executeDbCommand({mapreduce: "deals", map: map_sales_total_by_month.toString(), reduce: reduce_count_total_by_month.toString(), out: {inline: 1}, query: {created: {$gt: new Date(year, month, 1)}}},
		function(err, deals){
			if(!err){
				console.log(deals);
				if(!deals){
					console.log('No se han encontrado coincidencias')
				}else{
					res.writeHead(200, { 'Content-Type': 'application/json' });   
					res.write(JSON.stringify(deals.documents[0].results))
					res.end();
				}
			}else{
				if (err) throw err;
			}
		});
}

//Total de cupones

function map_coupon_total_by_month() {
	var total = 0  
	for (var idx = 0; idx < this.sales.length; idx++) {
		total= total + this.sales[idx].coupons.length;
	}
	emit((this.created.getMonth()+1).toString() , total);
}

exports.calculate_coupon_total_by_month = function(req, res, next){
	var today = new Date();
	var year;
	var month;
	if(today.getMonth()>=5){
		year = today.getFullYear();
		month = today.getMonth()-5;
	}else{
		year = today.getFullYear()-1;
		month = today.getMonth()-5+12;
	}
	mongoose.connection.db.executeDbCommand({mapreduce: "deals", map: map_coupon_total_by_month.toString(), reduce: reduce_count_total_by_month.toString(), out: {inline: 1}, query: {created: {$gt: new Date(year, month, 1)}}}, 
		function(err, deals){
			if(!err){
				console.log(deals);
				if(!deals){
					console.log('No se han encontrado coincidencias')
				}else{
					res.writeHead(200, { 'Content-Type': 'application/json' });   
					res.write(JSON.stringify(deals.documents[0].results))
					res.end();
				}
			}else{
				if (err) throw err;
			}
		});
}