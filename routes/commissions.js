var EventModel = require('../models/event').EventModel;

module.exports = function(app){

	app.on('sale', function (deal , user, sale) {

		//user es el usuario que la compró
		//Necesitamos usuarios para comparar los niveles
		// usuario promotor, seller, partner.

		//Commision al promoter
		var commission_new = new CommissionModel();          
		commission_new.user_id = user.promoter;
		commission_new.sale = sale._id;
		commission_new.amount = (deal.promoter_percentage)/100*(deal.special_price)*(sale.coupons.length);
		commission_new.save();

		//Commission seller
		var commission_new = new CommissionModel(); 
		commission_new.user_id = deal.seller;
		commission_new.sale = sale._id;
		commission_new.amount = (deal.seller_percentage)/100*(deal.special_price)*(sale.coupons.length);

		//Commission partner
		DealModel.findById( req.body.id ).populate("store").exec(function(err, branch){
			var commission_new = new CommissionModel(); 
			commission_new.user_id = deal.seller;
			commission_new.sale = sale._id;
			commission_new.amount = (deal.seller_percentage)/100*(deal.special_price)*(sale.coupons.length);
		});
		
	});

}