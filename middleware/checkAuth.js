

exports.user = function (req, res, next) {
	if (!req.session.user) {
		res.render('error');
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
	if (!util.has_role("member",req.session.user.roles)) {
		res.render('error');
	} else {
		next();
	}
}

exports.generalAdministrator = function (req, res, next) {
	if (!util.has_role("generaladministrator",req.session.user.roles)) {
		res.render('error');
	} else {
		next();
	}
}

exports.franchisorAdministrator = function (req, res, next) {
	if (!util.has_role("franchisoradministrator",req.session.user.roles)) {
		res.render('error');
	} else {
		next();
	}
}