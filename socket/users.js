

module.exports = function(socket, session){

	socket.on('LoggedInSocketId', function (user) {
		session.expose.socket_id = socket.id;
		console.log("Socket");
		console.log(req.session.expose.socket_id);
	});
	
}