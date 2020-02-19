const socketIO = require('socket.io');

function connectChat(server) {
    const io = socketIO(server);
    io.on('connection', (socket) => {
        console.log('New Websocket Connection');
        socket.emit('message', "Welcome!");
        socket.on('sendMessage', (message, callback) => {
            io.emit('message', message);
            callback("Delivered");
        });
        socket.broadcast.emit('message', "A new user has joined");
        socket.on('location', (coords, callback) => {
            io.emit('locationMessage', `http://google.com/maps?q=${coords.lat},${coords.lon}`);
            callback('Location Shared');
        });


        socket.on('disconnect', () => {
            io.emit('message', "A user has left")
        });
    })
}


module.exports.connectChat = connectChat;