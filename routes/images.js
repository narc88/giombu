var ImageModel = require('../models/image').ImageModel;

//Modelos donde se cargan fotos
var UserModel = require('../models/user').UserModel;
var DealModel = require('../models/deal').DealModel;
var StoreModel = require('../models/store').StoreModel;

var fs = require('fs');

module.exports = function(app){

	var save_image = function(dir){
		return function(req,res){
			var Model;
			
			switch(req.params.param){
				case "users":
					Model = UserModel;
				break;
				case "deals":
					Model = DealModel;
				break;
				case "stores":
					Model = StoreModel;
				break;
				default:
					console.log(req.params.id)
			}
			var img = req.files.image.image;
				var name = req.body.image.name;
				var path = dir+img.name;
				fs.rename(img.path, path, function(err){
					var image = new ImageModel()
					image.name = name,
					image.path = img.name
					image.save(function(err){
						Model.findOne({"_id" : req.params.id }).exec(function(err, model){
							model.images.push(image._id)
							model.save(function(err){
								if(err)
									throw err
								res.redirect("back")
							})
							
						});
						
					});
				})
			
			
			
		}
	}

	app.post('/images/upload/:param/:id', save_image(app.get('photos')));
}