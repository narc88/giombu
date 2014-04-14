var UserModel = require('../models/user').UserModel;
var ImageModel = require('../models/image').ImageModel;
var DealModel = require('../models/deal').DealModel;
var SubscriberModel = require('../models/subscriber').SubscriberModel;
var BonusModel = require('../models/bonus').BonusModel;

var util = require('../helpers/util');
var encrypter = require('../helpers/encryption');
module.exports = function(app){
	

	app.get('/users', function(req, res){
		UserModel.find().exec( function(err, users){
			if (err) throw err;
			res.render('users/list', {title: 'Lista de usuarios', users:users});
		});
	});

	app.get('/user/:id', function(req, res){
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
								res.render('users/view', {title: 'Perfil', user: user,bonuses:bonuses, contacts:contacts,deals:deals,subscriptions:subscriptions});
							}else{
								console.log('Error'+ err);
							}
						});
					});
				});
			});
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
		user_new.roles.push("user")
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

	app.get('/users/edit/:id', function(req, res){
		UserModel.findById( req.params.id , function(err, user){
			res.render('users/welcome', {title: 'Cargar Oferta', user:user})
		});
			
	});

	app.post('/users/update', function(req, res){
		var user_new = new UserModel();
		UserModel.findById( req.session.user._id , function(err, user){
			user_new = user;
			user_new.username = req.body.username
			user_new.name = req.body.name
			user_new.lname = req.body.lname
			user_new.email = req.body.email
			user_new.phone = req.body.phone
			user_new.mobile = req.body.mobile
			user_new.address = req.body.address
			user_new.country = req.body.country
			user_new.city = req.body.city
			user_new.state = req.body.state
			user_new.zip = req.body.zip
			console.log(user_new);
			user_new.save(function(err){
				if(!err){
					res.redirect('/users/'+user_new._id);
				} else {
					console.log("Error: - " + err);
				}
				res.render('users/welcome');
			});
		});
		res.render('users/welcome', {title: 'Cargar Oferta'})	
	});
}
