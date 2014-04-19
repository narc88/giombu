var UserModel = require('../models/user').UserModel;
var UserRoles = require('../models/user').UserRoles;


module.exports = function(app){

	app.get('/sellers/register', function (req, res, next) {
		res.render('sellers/register', {title: 'Registro de Vendedor'});
	});

	app.post('/sellers/add', function (req, res, next) {
		UserModel.findById( req.session.user._id , function(err, user){

			user.roles.push(UserRoles.getSeller());

			user.save(function(err){
				
				if (err) throw err;

				res.render('index', {
					title 		: 'Giombu',
					message 	: 'Su usuario ahora es vendedor'
				});

			});
		});

	});


	//Filtrar los que son vendedores.
	app.get('/intranet/sellers/list', function (req, res, next) {
		UserModel.find({}).where('roles').in('seller').exec(function(err, users){
			if(!err){
				if(users){
					res.render('sellers/list', {title: 'Vendedores', users : users, user:req.session.user});
				}else{
					console.log('No hay vendedores');
				}
			}else{
				console.log('No lo encontre');
			}
		});
	});

}


