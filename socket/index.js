


module.exports = function(err, socket, session){

	if (err) throw err;

	//Ejemplo - hay que eliminarlo
	socket.emit('news', { hello: 'world', session : session });
	socket.on('my other event', function (data) {
		console.log(data);
	});


	//Esta bueno distribuir las llamadas en modulos para evitar generar una tormenta de codigo
	require('./users')(socket, session);


};