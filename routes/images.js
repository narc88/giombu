var ImageModel = require('../models/country').ImageModel;
var CurrencyModel = require('../models/currency').CurrencyModel;
var StateModel = require('../models/state').StateModel;
var fs = require('fs');

module.exports = function(app){

	var save_image = function(dir){
		return function(res,req){
			var Model;
			switch(req.params.param){
				case "users":
					Model = require('../models/user').UserModel;
				break;
			}
			var img = req.files.image.image;
				var name = req.body.image.name;
				var path = join(dir, img.name);
				fs.rename(img.path, path, function(err){
					ImageModel.create({
						name:name,
						path:img.name
					}, function(){
						Model.findOne({"_id" : req.param.id }).exec(function(err, model){
							model.images.push(image._id)
							model.save(function(err){
								res.redirect("back")
							})
							
						});
						
					});
				})
			
			
			
		}
	}

	app.post('/images/upload/:param/:id', save_image(app.get('photos')));
}