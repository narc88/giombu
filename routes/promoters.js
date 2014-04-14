var UserModel = require('../models/user').UserModel;
var PromoterModel = require('../models/promoter').PromoterModel;
var PromoterTextModel = require('../models/promoter_text').PromoterTextModel;



module.exports = function(app){




	app.get('/promoters/register', function (req, res, next) {
		res.render('promoters/register', {title: 'Registro de Promotor' , user:req.session.user});
	});




	app.post('/promoters/add', function (req, res, next) {
		UserModel.findById( req.session.user._id , function(err, user){

			var promoter_new = new PromoterModel();
			var promoter_text_new = new PromoterTextModel();
			promoter_text_new.page_title = req.body.page_title
			promoter_text_new.page_body = req.body.page_body
			promoter_text_new.subscribers_invite = req.body.subscribers_invite
			promoter_new.parent_id = req.body.parent_id
			promoter_new.promoter_text = promoter_text_new

			req.session.user.promoter = promoter_new
			user.promoter = promoter_new

			user.save(function(err){
				if(!err){
					console.log(user);
				} else {
					console.log("Error: - " + err);
				}
			});
			res.render('users/register', {title: 'Cargar Oferta'});
		});
	});





	app.get('/intranet/promoters/list_sons/:start_item', function (req, res, next) {
		UserModel.find({ 'promoter.parent_id': req.session.user._id}).skip(req.params.start_item).limit(10).exec(function(err, sons){
			if(sons){
				res.render('promoters/list_sons', {title: 'Tus promotores',user:req.session.user, sons:sons});
			}else{
				var sons = new Array(1);
				sons[0] = req.session.user;

				console.log(sons);
				res.render('promoters/list_sons', {title: 'Tus promotores',user:req.session.user, sons:sons});
			}
			console.log(sons);
		});
	});


}

