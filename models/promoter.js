// Creación de la Conexión
var mongoose = require('mongoose');

var PromoterSchema = exports.PromoterSchema = new mongoose.Schema({
	page_visits				: { type: Number, min: 0},
	level					: { type: mongoose.Schema.ObjectId, ref: 'Level' },
	confirm_promoter_token	: { type: String},
	page_title				: { type: String, required: true},
	page_body				: { type: String, required: true},
	subscribers_invite		: { type: String, required: true},
	parent_id 				: { type: mongoose.Schema.ObjectId, ref: 'User' },
	created    		 	    : {type: Date, default: Date.now },
	modified				: {type: Date, default: Date.now }
})
PromoterSchema.set('versionKey', false);
exports.PromoterModel = mongoose.model('Promoter', PromoterSchema);
