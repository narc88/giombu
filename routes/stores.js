var StoreModel = require('../models/store').StoreModel;
var UserModel = require('../models/user').UserModel;
var UserRoles = require('../models/user').UserRoles;
var BranchModel = require('../models/branch').BranchModel;
var CheckAuth = require('../middleware/checkAuth');
var FranchisorModel = require('../models/franchisor').FranchisorModel;
var CountryModel = require('../models/country').CountryModel;
// var Encrypter = require('./encryption_controller');

var createStoreBranch = function(req, res, message){
		CountryModel.find({}, function(err, countries){

			if (err) throw err;

			res.render('stores/create_store_branch', {
				title 			: 'Cargar tienda',
				user 			: req.session.user,
				countries 		: countries,
				message 		: message
			});

		});
}

module.exports = function(app){

	app.get('/stores', function(req, res, next){
		StoreModel.find({}).exec(function(err, stores){
			if(!err){
				if(stores){
						res.render('stores/list', {title: 'Stores', stores : stores});
				}else{
					console.log('store - view - No se encontro el store ( ' + req.params.id +' )');
				}
			}else{
				console.log('store - view - '.red.bold + err);
			}

		});
	});

	app.get('/stores/create_store_branch', CheckAuth.user, CheckAuth.seller,function (req, res, next) {
		createStoreBranch(req, res);
	});


	app.post('/stores/add_store_branch', CheckAuth.user, CheckAuth.seller, function (req, res, next) {


		//TODO add the Franchisor to the Store
		//and add the Franchise adn City to the Branch

		UserModel.findOne({ username : req.body.branch.partner }, function(err, partner){

			if (err) throw err;

			var branch = new BranchModel(req.body.branch);
			branch.default = true;
			
			var store = new StoreModel(req.body.store);

			if (partner){
				branch.partner = partner._id;
				var index = partner.roles.indexOf(UserRoles.getPartner());

				if(index == -1){
					partner.roles.push(UserRoles.getPartner());
				}

				partner.save(function(err){
					if (err) throw err;
				});
			}else{
				console.log('Stores - ERROR - No existe el usuario ingresado');
				createStoreBranch(req, res,
					'No existe el usuario ingresado'
					);

				return;
			}

			store.creator = req.session.user._id;
			store.branches.push(branch);

			store.save(function(err){
				
				if (err){
					console.log('Stores - ERROR - ' + err);
					createStoreBranch(req, res, err);
					return;
				}else{

					res.redirect('/stores/view/' + store._id);
					
				}

				
			});

		});

	});


	app.get('/stores/edit/:id', function (req, res, next) {
		StoreModel.findById( req.params.id , function(err, user){
			if(!err){
				if(user){
					res.render('stores/edit', {title: 'Editar Store', user : user});
				}else{
					console.log('Usuario no encontrado, cualquiera el error');
				}
			}else{
				console.log('No lo encontre');
			}
		});
	});


	app.post('/stores/update/:id', function (req, res, next) {
		var store_new = new StoreModel();
		StoreModel.findById( req.params.id , function(err, user){
			store_new = user;
			store_new.name = req.body.name
			store_new.about = req.body.about
			store_new.email = req.body.email
			store_new.save(function(err){
				if(!err){
					console.log(store_new);
				} else {
					console.log("Error: - " + err);
				}
				res.render('users/welcome');
			});
		});
		res.render('users/welcome', {title: 'Cargar Oferta'});
	});


	//Devuelve la lista de stores filtrando por el franquiciante
	app.get('/intranet/stores/list', function (req, res, next) {
		console.log("Lista de stores")
		StoreModel.find( /*req.params.franchisor_id*/ {} ).exec( function(err, stores){
			if(!err){
				if(stores){
					console.log(stores)
					res.render('stores/list', {title: 'Tiendas', stores : stores, user:req.session.user});
				}else{
					console.log('Esta franquiciante no tiene stores');
				}
			}else{
				console.log('No lo encontre');
			}
		});
	});


	app.get('/stores/view/:id', function(req, res, next){

		console.log('store - view'.cyan.bold);
		console.log('store - view - Busco el store ( ' + req.params.id +' )');

		StoreModel.findById( req.params.id ).exec(function(err, store){
			if(!err){
				if(store){
					var callback = function(){
						res.render('stores/view', {title: 'store', store : store, user:req.session.user});
					}
					console.log('store - view - Se encontro el store ( ' + req.params.id +' )');
					StoreModel.populate(store, {
						path: 'branches.partner'}
						, callback)


				}else{
					console.log('store - view - No se encontro el store ( ' + req.params.id +' )');
				}
			}else{
				console.log('store - view - '.red.bold + err);
			}

		});
	});


	//ESTA FUNCION NO TENIA REFERENCIAS EN EL PROYECTO ANTERIOR
	exports.add_store = function (req, res, next) {
		var store_new = new StoreModel();
		store_new.name = req.body.name
		store_new.about = req.body.about
		store_new.email = req.body.email

		store_new.save(function(err){
			if(!err){
				console.log(store_new);
			} else {
				console.log("Error: - " + err);
			}
			res.redirect('store/welcome');
		});
		res.render('store/welcome', {title: 'Cargar Oferta'});
	}


	app.get('/intranet/stores/assign_partner/:id', function(req, res, next){
		StoreModel.findById( req.params.id ).exec( function(err, store){
			if(!err){
				if(store){
					res.render('stores/assign_partner', {title: 'Perfil', user:req.session.user, store:store});

				}else{
					console.log('users - view - No se encontro el user ( ' + req.body.user_id +' )');
				}
			}else{
				console.log('users - view - '.red.bold + err);
			}
		});
	});


	app.post('/intranet/stores/assign_partner_save', function(req, res, next){
		StoreModel.findById( req.body.store_id ).exec( function(err, store){
			if(!err){
				if(store && req.body.partner_id){
					UserModel.findOne({ username : req.body.partner_id }, function(err, user_found){
						console.log(user_found._id)
						store.branches[0].partner = user_found._id
						store.save(function(err){
							if(!err){
								user_found.partner = true;
								user_found.save(function(err){
									res.render('stores/view', {title: 'Perfil', user:req.session.user, store:store});
								});
							}else{
								console.log(err)
							}
						}
						);

					});

				}else{
					if (err) return handleError(err);
					console.log('usersss - view - No se encontro el user ( ' + req.body.user_id +' )');
				}
			}else{
				console.log('usessrs - view - '.red.bold + err);
			}
		});
	});



}
