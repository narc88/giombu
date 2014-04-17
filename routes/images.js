var ImageModel = require('../models/country').ImageModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var StateModel = require('../models/state').StateModel;
var fs = require('fs');

module.exports = function(app){

	var save_image = function(dir){
		return function(res,req){
			switch(req.params.param){
				//case
			}
			console.log(req)
			var img = req.files.image.image;
			var name = req.body.image.name;
			var path = join(dir, img.name);
			fs.rename(img.path, path, function(err){
				ImageModel.create({
					name:name,
					path:img.name
				}, function(){
					res.redirect('/')
				});
			})
		}
	}

	app.post('/images/upload/:param/:id', save_image(app.get('photos')));
}