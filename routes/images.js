var ImageModel = require('../models/image').ImageModel;

//Modelos donde se cargan fotos
var UserModel = require('../models/user').UserModel;
var DealModel = require('../models/deal').DealModel;
var StoreModel = require('../models/store').StoreModel;

var fs = require('fs');

module.exports = function(app){
	var get_model = function(model_name){
		var Model;
		switch(model_name){
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
				console.log(req.params)
		}
		return Model;
	}
	var save_image = function(dir){
		return function(req,res){
			var Model = get_model(req.params.param);
			var img = req.files.image.image;
			var format = img.name.substr(img.name.indexOf("."));
			fs.rename(img.path, dir+"/"+req.params.param+"/"+req.body.image.name + format, function(err){
				var image = new ImageModel()
				image.filename =  req.body.image.name + format;
				image.save(function(err){
					console.log(image)
					if(err)
						throw err
					Model.findOne({"_id" : req.params.elem_id }).exec(function(err, model){
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

	app.post('/images/upload/:param/:image_id', save_image(app.get('photos')));

	var delete_image = function(dir){
		return function(req,res){
			console.log("me llamaban")
			var Model = get_model(req.params.param);
			
				Model.update(
				  { _id: req.params.param_id },
				  { $pull: { 'images': req.params.image_id } }
				).exec(function(){
					
				res.redirect("back")
				})
			
			
		}
	}

	app.get('/images/delete/:param/:param_id/:image_id', delete_image(app.get('photos')));
}

