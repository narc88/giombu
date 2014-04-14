// Creación de la Conexión
var mongoose = require('mongoose');


var Schema = require('mongoose').Schema

var PromoterTextSchema = exports.PromoterTextSchema = new Schema({
	page_title			: { type: String, required: true},
	page_body			: { type: String, required: true},
	subscribers_invite	: { type: String, required: true},
	created    		    : {type: Date, default: Date.now },
	modified			: {type: Date, default: Date.now }
	
})	

exports.PromoterTextModel = mongoose.model('PromoterText', exports.PromoterTextSchema);
