$(document).ready(function($){
	var socket = io.connect('http://localhost');
	alert("login")
	socket.on('LoggedIn', function (user) {
		alert("EEEPA")
	    socket.emit('LoggedInSocketId', {id: user.id});
	});
});