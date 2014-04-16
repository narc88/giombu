// Creación de la Conexión
var mongoose = require('mongoose');


var PromoterSchema = require('./promoter').PromoterSchema
var ImageSchema = require('./image').ImageSchema;
var InvitationSchema = require('./invitation').InvitationSchema;

var UserSchema = new mongoose.Schema({
	username				: { type: String, unique:true, required: true},
	email					: { type: String, required: true},
	password				: { type: String, required: true},
	facebook_id				: { type: Number},
	reset_password_token	: String,
	reset_password_sent_at	: Date,
	last_sign_in_at			: Date,
	current_sign_in_at		: Date,
	last_sign_in_ip			: String,
	name					: { type: String, required: true},
	lname					: { type: String, required: true},
	birthday				: { type: Date, required: true},
	gender					: { type: String},
	phone					: { type: String},
	mobile					: { type: String},
	address					: { type: String},
	city					: { type: String},
	country					: { type: String},
	state					: { type: String},
	zip						: { type: String},
	created    			    : {type: Date, default: Date.now },
	modified				: {type: Date, default: Date.now },
	promoter_id 			: { type: mongoose.Schema.ObjectId, ref: 'User' },
	level					: { type: mongoose.Schema.ObjectId, ref: 'Level' },
	//Relacionados
	 invitation				: [InvitationSchema],
	 image 					: [ImageSchema],
	 seller					: Boolean,
	 promoter 				: [PromoterSchema],
	 roles 					: [{type:String}],
	 partner 				: Boolean,
	 franchisor			: [{ type: mongoose.Schema.ObjectId, ref: 'Franchisor' }],
	//Verificar estos campos
});

UserSchema.set('versionKey', false);
exports.UserModel = mongoose.model('User', UserSchema);
