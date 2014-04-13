// Creación de la Conexión
var mongoose = require('mongoose');

var FranchisorSchema =  new Schema({
	name				: { type: String },
	default_domain		: { type: String },
	secure_domain		: { type: String },
	cctdl				: { type: String },
	email				: { type: String },
	smtp				: { type: String },
	default_timezone	: { type: Number },
	language			: { type: String },
	fanpage				: { type: String },
	country	   			: { type: mongoose.Schema.ObjectId, ref: 'Country' },	
	currency   			: { type: mongoose.Schema.ObjectId, ref: 'Currency' },
	created    		    :  {type: Date, default: Date.now },
	modified			:  {type: Date, default: Date.now }
});

exports.FranchisorModel = mongoose.model('Franchisor', FranchisorSchema);