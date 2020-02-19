const socketIO = require('socket.io');

function connectChat(server) {
    const io = socketIO(server);
    io.on('connection', () => {
        console.log("New Websocket Connection")
    })
}


module.exports.connectChat = connectChat;