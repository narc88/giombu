var mongoose = require('mongoose');

CurrencyValueSchema = exports.CurrencyValueSchema = new mongoose.Schema({
	value				: { type: Number, required: true},
	date 				: { type: Date, required: true},
});

exports.CurrencyValueModel = mongoose.model('CurrencyValue', CurrencyValueSchema);