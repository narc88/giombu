var UserModel = require('../models/user').UserModel;
var users = require('../helpers/util');
var users = require('../helpers/util');
module.exports = function(app){
	

	app.get('/users', function(req, res){

		res.send("respond with a resource");
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
		user_new.password = Encrypter.encrypt(req.body.password);
		user_new.gender = req.body.gender
		user_new.birthday = Util.date_mongo(req.body.birthday, "00:00")
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
}
