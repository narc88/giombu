var EventModel = require('../models/event').EventModel;
var CouponModel = require('../models/coupon').CouponModel;
var BonusModel = require('../models/bonus').BonusModel;
var CommissionModel = require('../models/commission').CommissionModel;

module.exports = function(app){

	app.on('commission_event', function (deal , type, commission) {
		var query = EventModel.findOne({ 'name': type });
		query.exec(function (err, event) {
			if (err) return handleError("Commission_Seller"+err);
			new_new.event = event._id;
			new_new.to_user = deal.seller;
			new_new.deal = deal._id;				
			new_new.save(function(err){

			});
	});

	app.on('redeem_coupon', function(deal, sale, code ){
		//Commission partner
		StoreModel.find({"branches":{ $in : [sale.branch]}}).populate("branches").exec(function(err, store){
			if(store){
				var branch = store.branches.id(sale.branch)
				var commission_new = new CommissionModel(); 
				commission_new.user_id = deal.seller;
				//MARCAR EL CUPON COMO CANJEADO
				var coupon = deal.sales.coupon.id(code);
				commission_new.sale = sale._id;
				commission_new.currency = deal.currency
				commission_new.amount = (deal.promoter_percentage)/100*(deal.special_price)*(sale.coupons.length);
			}	
		})
		
	})
}