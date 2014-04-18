var UserModel 	= require('../models/user').UserModel;
var UserRoles 	= require('../models/user').UserRoles;
var ImageModel 	= require('../models/image').ImageModel;
var DealModel 	= require('../models/deal').DealModel;
var SubscriberModel = require('../models/subscriber').SubscriberModel;
var BonusModel = require('../models/bonus').BonusModel;
var LevelModel = require('../models/level').LevelModel;

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
		res.render('users/create', {title: 'Registro'});
	});


	app.post('/users/save', function(req, res){
		var user_new = new UserModel();
		user_new.username = req.body.username
		user_new.name = req.body.name
		user_new.lname = req.body.lname
		user_new.email = req.body.email
		user_new.password = encrypter.encrypt(req.body.password);
		user_new.gender = req.body.gender
		user_new.birthday = util.date_mongo(req.body.birthday, "00:00")
		user_new.phone = req.body.phone
		user_new.mobile = req.body.mobile
		user_new.address = req.body.address
		user_new.roles.push(UserRoles.getUser());
		user_new.country = req.body.country
		user_new.state = req.body.state
		user_new.city = req.body.city
		user_new.zip = req.body.zip
		user_new.is_active = true;
		user_new.image.push(new ImageModel());

		
		if(req.body.inviter){
			UserModel.findOne({username: req.body.inviter}, function(err, doc){
				user_new.promoter_id = doc._id;
				user_new.save(function(err){
					if(!err){
						res.redirect('/');
					} else {
						if (err) throw err;
						console.log("Error: - " + err);
					}
				});
			});
		}else{
			user_new.save(function(err){
				if(!err){
					res.redirect('/');
				} else {
					console.log("Error: - " + err);
					if (err) throw err;
				}
			});
		}
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
							req.session.expose.user.username = user.username;
							req.session.expose.user._id = user._id;
							req.session.expose.user.name = user.name;
							req.session.expose.user.lname = user.lname;

							
							updateUserLevel(req, res, function(){
								console.log("Usuario logueado: ");
								console.log(req.session.user);
								res.redirect('/', { 
									message : 'Se ha logueado correctamente'
								});
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
						req.session.userData.level = level;

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



	//Esta llamada es muy general es por eso que debe ir a lo ultimo.
	//Por ejemplo si esta llamada esta al principio del archivo, cuando se llama a /users/login
	//toma 'login' como si fuese un ID de algun user. Este caso es valido para llamadas similares.
	app.get('/users/:id', function(req, res){
		UserModel.findById(req.params.id).exec( function(err, user){
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
