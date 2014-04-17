var UserRoles = require('../models/user').UserRoles;

exports.user = function (req, res, next) {
	if (!req.session.user) {
		res.render('users/login');
	} else {
		next();
	}
}

exports.promoter = function (req, res, next) {
	if (!req.session.user.promoter) {
		res.render('error');
	} else {
		next();
	}
}

exports.seller = function (req, res, next) {
	if (!req.session.user.seller) {
		res.render('error');
	} else {
		next();
	}
}

exports.partner = function (req, res, next) {
	if (!req.session.user.partner) {
		res.render('error');
	} else {
		next();
	}
}
exports.member = function (req, res, next) {
	var index = req.session.user.roles.indexOf(UserRoles.getMember());
	if (index == -1) {
		res.render('error');
	} else {
		next();
	}
}

exports.generalAdministrator = function (req, res, next) {
	var index = req.session.user.roles.indexOf(UserRoles.getGeneralAdministrator());
	if (index == -1) {
		res.render('error');
	} else {
		next();
	}
}

exports.franchisorAdministrator = function (req, res, next) {
	var index = req.session.user.roles.indexOf(UserRoles.getFranchisorAdministrator());
	if (index == -1) {
		res.render('error');
	} else {
		next();
	}
}