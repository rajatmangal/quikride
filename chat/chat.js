const socketIO = require('socket.io');

function connectChat(server) {
    const io = socketIO(server);
    io.on('connection', (socket) => {
        console.log('New Websocket Connection');
        socket.emit('message', "Welcome!");
        socket.on('sendMessage', (message) => {
            io.emit('message', message);
        });
        socket.broadcast.emit('message', "A new user has joined");
        socket.on('location', (coords) => {
            io.emit('message', `http://google.com/maps?q=${coords.lat},${coords.lon}`)
        });


        socket.on('disconnect', () => {
            io.emit('message', "A user has left")
        });
    })
}


module.exports.connectChat = connectChat;