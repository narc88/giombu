var BonusModel = require('../models/bonus').BonusModel;
var UserModel = require('../models/user').UserModel;
var DealModel = require('../models/deal').DealModel;
var PaymentModel = require('../models/payment').PaymentModel;
var BankAccountModel = require('../models/bank_account').BankAccountModel;

module.exports = function(app){
	app.get('/payments/create', function (req, res, next) {
		today = new Date()
		month_ago = new Date()
		month_ago.setMonth(today.getMonth()-1)
		BonusModel.find({user:req.session.user._id,  paid_date : {"$gte": month_ago}}).exec(function(err, bonuses ){
			BankAccountModel.find({user:req.session.user._id}).exec(function(err, bonuses ){
				res.render('payments/create', {title: 'Seccion de pagos' , bonuses:bonuses});
			});
		});
	  
	});

	app.post('/payments/new', function (req, res, next) {
		UserModel.findOne({_id:req.session.user._id}).exec(function(err, user ){
			var amount = 0;
			//esto va a haber que cambiarlo mas que probablemente.
			if(typeof user.promoter[0] !== "undefined"){
				if(typeof req.param('commissionsPromoter') !== "undefined"){
					for (var i = user.promoter[0].commissions.length - 1; i >= 0; i--) { //error aca y en el otro loop

						if(req.param('commissionsPromoter').indexOf(user.promoter[0].commissions[i]._id) >= 0){
							amount = user.promoter[0].commissions[i].amount + amount;
							user.promoter[0].commissions[i].paid_date = Date.now
							console.log(user.seller[0].commissions[i])
						}
					};	
				}
				UserModel.update({'promoter.0.commissions.$.id': { $in : req.param('commissionsPromoter') }}, {'$set': {
				    'promoter.0.commissions.$.paid_date': Date.now
				}}).exec(function(err, numberAffected){
						if(!err){
							console.log(numberAffected)	
						}else{
							console.log(err)
							if (err) throw err;
							res.redirect('/')
						}
					});
			}
			if(typeof user.seller[0] !== "undefined"){
				if(typeof req.param('commissionsSeller') !== "undefined"){
					for (var i = user.seller[0].commissions.length - 1; i >= 0; i--) {
						if(req.param('commissionsSeller').indexOf(user.seller[0].commissions[i]._id) >= 0){
							amount = user.seller[0].commissions[i].amount + amount;
							user.seller[0].commissions[i].paid_date = Date.now
							console.log(user.seller[0].commissions[i])
						}
					};
				}
			}
			
			var bonusesSelected = [];
			if(typeof req.param('bonuses') !== "Array"){
				bonusesSelected.push(req.param('bonuses'))
			}else{
				bonusesSelected = req.param('bonuses')
			}
			var ids = []
			for (var i = bonusesSelected.length - 1; i >= 0; i--) {
				ids.push( mongoose.Types.ObjectId(bonusesSelected[i]))
			};
			BonusModel.find({user:req.session.user._id, _id :{ $in : ids }}).exec(function(err,  bonuses ){
				
				if(bonuses){
					for (var i = bonuses.length - 1; i >= 0; i--) {
						amount = bonuses[i].amount + amount;
					};
					
				}else{
					
				}
				payment_new = new PaymentModel();
				payment_new.amount = amount;
				payment_new.user = req.session.user._id;
				payment_new.save(function(){
					req.session.messagge = "Pago creado, no podrá volver a realizar esta acción hasta dentro de 7 dias";
					BonusModel.update({user:req.session.user._id, _id :{ $in : ids }}, { $set: { paid_date: Date.now }}, { multi: true },function (err, numberAffected, raw) {
					 	req.session.user= user;
					 	user.save(function(){
					 		res.redirect('/payments/create');
					 	})			
					});
				})
			});
		});

		
	});
}
