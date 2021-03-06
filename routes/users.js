var UserModel 	= require('../models/user').UserModel;
var UserRoles 	= require('../models/user').UserRoles;
var ImageModel 	= require('../models/image').ImageModel;
var DealModel 	= require('../models/deal').DealModel;
var SubscriberModel = require('../models/subscriber').SubscriberModel;
var BonusModel = require('../models/bonus').BonusModel;
var LevelModel = require('../models/level').LevelModel;
var CountryModel = require('../models/country').CountryModel;
var StateModel = require('../models/state').StateModel;
var CityModel = require('../models/city').CityModel;

var util = require('../helpers/util');
var encrypter = require('../helpers/encryption');

module.exports = function(app){
		

	//DELETE ME!
	app.get('/testRoles', function(req, res, next){
		res.send(UserRoles.getAdmin());
	});
	
	//Este regex nos permite pedir la misma funcion como json, para usar donde necesitamos elegir quien nos invito y similar.
	app.get('/users:format(.json)?', function(req, res, next){
		UserModel.find().exec( function(err, users){
			if (err) throw err;
			if(req.params.format){
				usernames = [];
				for (var i = users.length - 1; i >= 0; i--) {
					usernames.push(users[i].username)
				};
				res.send(usernames)
			}
			res.render('users/list', {title: 'Lista de usuarios', users:users});
		});
	});
	

	app.get('/users/create', function(req, res){
		CountryModel.find({}, function(err, countries){
			if (err) throw err;

			StateModel.find({}, function(err, states){
				if (err) throw err;

				CityModel.find({}, function(err, cities){
					if (err) throw err;

					res.render('users/create', {
						title 		: 'Registro',
						countries 	: countries,
						states		: states,
						cities		: cities
					});

				});
				
			});

		});
	});


	app.post('/users/save', function(req, res){

		req.body.user.password = encrypter.encrypt(req.body.user.password);

		var user = new UserModel(req.body.user);

		console.log('New User');
		console.log(user);

		user.roles.push(UserRoles.getUser());
		

		UserModel.findOne({username: req.body.inviter}, function(err, inviter){

			if (err) throw err;

			if(inviter){
				user.promoter_id = inviter._id;
			}

			user.save(function(err){
				if (err) throw err;
				res.redirect('/');
			});
		});
		
	});

	//Habria que agregar validaciones a esta llamada.
	//un usuario comun solo debe poder editar sus datos.
	//y solo el admin debe poder editar los datos de cualquier usuario.
	app.get('/users/edit/:id', function(req, res){
		UserModel.findById( req.params.id , function(err, user){

			if (err) throw err;

			res.render('users/edit', {
				title 	: 'Editar usuario',
				user 	: user
			});
		});
			
	});

	//Habria que agregar validaciones a esta llamada.
	//un usuario comun solo debe poder editar sus datos.
	//y solo el admin debe poder editar los datos de cualquier usuario.
	app.post('/users/update', function(req, res){

		UserModel.findById( req.body.user._id , function(err, user){
			user.username = req.body.username;
			user.name = req.body.name;
			user.lname = req.body.lname;
			user.email = req.body.email;
			user.phone = req.body.phone;
			user.mobile = req.body.mobile;
			user.address = req.body.address;
			user.country = req.body.country;
			user.city = req.body.city;
			user.state = req.body.state;
			user.zip = req.body.zip;
			console.log(user);
			user.save(function(err){

				if (err) throw err;

				res.redirect('/users/'+user_new._id);
				
			});
		});
		res.render('users/welcome', {title: 'Cargar Oferta'})	
	});


	app.get('/users/login', function (req, res, next){
		res.render('users/login', { layout:true, title:'Autenticación'});
	});


	app.post('/users/login', function(req, res, next){
		UserModel.findOne({username: req.body.username}, function(err, user){
			if(!err){
				if(!user){
					res.redirect('/users/login');
				}else{
					if(user.password == encrypter.encrypt(req.body.password)){
							
							//Save the user in the session
							req.session.user = user;
							
							//Expose some user data to the front-end
							req.session.expose.selected_franchise = 'Guadalajara';
							req.session.expose.user = {};
							req.session.expose.user.username = user.username;
							req.session.expose.user._id = user._id;
							req.session.expose.user.name = user.name;
							req.session.expose.user.lname = user.lname;

							
							updateUserLevel(req, res, function(){
								console.log("Usuario logueado: ");
								console.log(req.session.user);
								res.redirect('/');
							});
							

					}else{
						res.redirect('/users/login');
						console.log('Failed'.red);
					}

				}

			}else{
				if (err) throw err;
				res.redirect('/');
			}
			
		});
	});


	app.get('/users/logout', function(req, res, next){
		delete req.session.user;
		req.session.messagge = 'Vuelva pronto';
		res.redirect('/')
	});


	function updateUserLevel(req, res, callback){

		UserModel.find({promoter_id : req.session.user._id}).exec(function (err, sons){
			if(sons){

				var number = sons.length/10+1;

				LevelModel.findOne({'number' : {$gte : number}}).sort({'number': 1}).exec(function(err, level){

					if (err) throw err;

					if(level){
						req.session.user.level = level._id;
						req.session.expose.user.level = level;

						req.session.user.save(function(err){
							if (err) throw err;	
							callback();						
						});

						
					}else{
						LevelModel.findOne({'number' : LevelModel.MAX_LEVEL}, function(err, level){

							if (err) throw err;

							req.session.user.level = level._id;

							req.session.user.save(function(err){
								if (err) throw err;							
								callback();
							});

						});
					}
				});
			}
		});

	}

	app.get('/users/validate/:username', function(req, res){
		UserModel.findOne( { username : req.params.username }, function(err, user){
			if (err) throw err;
			
			if(user){
				res.json(true);
			}else{
				res.json(false);
			}
		});
	});
		


	//Esta llamada es muy general es por eso que debe ir a lo ultimo.
	//Por ejemplo si esta llamada esta al principio del archivo, cuando se llama a /users/login
	//toma 'login' como si fuese un ID de algun user. Este caso es valido para llamadas similares.
	app.get('/users/:id', function(req, res){
		UserModel.findById(req.params.id).populate('images').exec( function(err, user){
			if (err) throw err;
			UserModel.find({'promoter_id':req.params.id}, function (err, contacts) {
				if (err) return handleError(err);
				DealModel.find({'sales.user':req.params.id}).sort("-created").exec(function (err, deals) {
					if (err) return handleError(err);
					SubscriberModel.find({'email':user.email}).populate('franchise').exec( function (err, subscriptions) {
						if (err) return handleError(err);
						BonusModel.find( {user : req.params.id}, function(err, bonuses){
							if(!err){
								console.log(user)
								res.render('users/view', {title: 'Perfil', user: user,bonuses:bonuses, contacts:contacts,deals:deals,subscriptions:subscriptions});
							}else{
								if (err) return handleError(err);
							}
						});
					});
				});
			});
		});
	});

}
