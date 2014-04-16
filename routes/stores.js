var StoreModel = require('../models/store').StoreModel;
var UserModel = require('../models/user').UserModel;
var BranchModel = require('../models/branch').BranchModel;
var Encrypter = require('./encryption_controller');



// //Stores


// app.get('/intranet/stores/assign_partner/:id', stores.assign_partner );
// app.post('/intranet/stores/assign_partner_save', stores.assign_partner_save );

module.exports = function(app){

	//ESTA FUNCION NO TENIA REFERENCIAS EN EL PROYECTO ANTERIOR
	exports.register = function (req, res, next) {
		res.render('stores/create', {title: 'Crear Store'});
	}

	app.get('/stores/create_store_branch', function (req, res, next) {
		res.render('stores/create_store_branch', {title: 'Cargar tienda',user:req.session.user});
	});


	app.post('/stores/add_store_branch', function (req, res, next) {
		var store_new = new StoreModel();
		store_new.name = req.body.store_name
		console.log(req.body)
		store_new.about = req.body.store_about
		store_new.email = req.body.store_email

		var branch_new = new BranchModel();
		branch_new.name = req.body.name
		branch_new.address = req.body.email
		branch_new.zip = req.body.zip
		branch_new.phone = req.body.phone
		branch_new.seller =  req.session.user._id
		branch_new.website = req.body.website
		branch_new.fanpage = req.body.fanpage
		branch_new.twitter = req.body.twitter
		branch_new.contact = req.body.contact
		branch_new.partner = req.body.partner
		branch_new.default = '1'
		store_new.branches.push(branch_new);
		store_new.save(function(err){
			if(!err){
				console.log(store_new);
				res.render('stores/view', {title: 'Comercio', store:store_new, user:req.session.user});
			} else {
				console.log("Error: - " + err);
			}
		});
	// res.render('users/register', {title: 'Cargar Oferta', user:req.session.user});
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


	app.get('/intranet/stores/add_image/:id', function (req, res, next) {
		StoreModel.findById( req.params.id , function(err, store){
			if(!err){
				if(store){
					res.render('stores/add_image', {title: 'Agregar imagen',store:store, user : req.session.user});
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
