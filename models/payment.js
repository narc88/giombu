// Creación de la Conexión
var mongoose = require('mongoose');

var CommissionSchema = require('./commission').CommissionSchema;
//Puede ir embebido dentro del promotor
var PaymentSchema = new mongoose.Schema({
	amount				: { type: Number,  min: 0},
	paid_date			: { type: Date},
	user				: { type: mongoose.Schema.ObjectId, ref: 'User'},
	bank_account		: { type: mongoose.Schema.ObjectId, ref: 'BankAccount'},
	currency			: { type: mongoose.Schema.ObjectId, ref: 'Currency'},
	commissions			: [{ type: mongoose.Schema.ObjectId, ref: 'Commissions'}],
	created				: { type: Date, default:Date.now },
	modified			: { type: Date, default:Date.now}
});
exports.PaymentModel = mongoose.model('Payment', PaymentSchema);