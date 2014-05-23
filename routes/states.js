var StateModel = require('../models/state').StateModel;


module.exports = function(app){

	app.get('/states/:id:format(.json)?', function(req, res, next){
		StateModel.find({ country : req.params.id}).sort("-name").exec( function(err, states){
			if (err) throw err;
			res.json(states);
		});
	});

}