const socketIO = require('socket.io');
const chatUtil = require('./chat-utils')

function connectChat(server) {
    const io = socketIO(server);
    io.on('connection', (socket) => {
        console.log('New Websocket Connection');
        socket.emit('message', chatUtil.generateMessage("Welcome!"));
        socket.on('sendMessage', (message, callback) => {
            io.emit('message', chatUtil.generateMessage(message));
            callback("Delivered");
        });
        socket.broadcast.emit('message', chatUtil.generateMessage("A new user has joined"));
        socket.on('location', (coords, callback) => {
            io.emit('locationMessage', chatUtil.generateLink(`http://google.com/maps?q=${coords.lat},${coords.lon}`));
            callback('Location Shared');
        });


        socket.on('disconnect', () => {
            io.emit('message', chatUtil.generateMessage("A user has left"))
        });
    })
}


module.exports.connectChat = connectChat;