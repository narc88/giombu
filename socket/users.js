

module.exports = function(socket){


	var io = require('socket.io').listen(2000);

	io.sockets.on('connection', function (socket) {
		console.log("emit");
		socket.emit('LoggedIn', {id : user._id});
		socket.on('LoggedInSocketId', function (user) {
			req.session.expose.socket_id = socket.id;
			console.log("Socket")
			console.log(req.session.expose.socket_id);
		});
	});

}