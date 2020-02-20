const socketIO = require('socket.io');
const chatUtil = require('./chat-utils')
const messages = require('../models/messages');
const mongoose = require('mongoose');

function connectChat(server) {
    const io = socketIO(server);
    io.on('connection', (socket) => {
        console.log('New Websocket Connection');
        socket.on('join', (id) => {
            socket.join(id);
            //io.to.emit (send message to everyone in room)
            //socket.broadcast.to.emit (send message to everyone in room except yourself)
            socket.emit('message', chatUtil.generateMessage("Welcome!"));
            socket.broadcast.to(id).emit('message', chatUtil.generateMessage("A new user has joined"));
        })
        socket.on('sendMessage', (message, callback) => {
            var newMessage = new messages({ sender: new mongoose.Types.ObjectId(), message:message, thread: new mongoose.Types.ObjectId(), created_at: new Date().getTime()});
            messages.create(newMessage, (err,res) => {
                 if(err) {
                     throw err;
                 }
                 else {
                    io.emit('message', chatUtil.generateMessage(message));
                    callback("Delivered");
                 }
             });
        });
        
        socket.on('location', (coords, callback) => {
            let url = `http://google.com/maps?q=${coords.lat},${coords.lon}`;
            var newMessage = new messages({ sender: '', message:url, thread: '', created_at: new Date().getTime()});
            messages.create(newMessage, (err,res) => {
                 if(err) {
                     throw err;
                 }
                 else {
                    io.emit('locationMessage', chatUtil.generateLink(url));
                    callback('Location Shared');
                 }
             });
            
        });


        socket.on('disconnect', () => {
            io.emit('message', chatUtil.generateMessage("A user has left"))
        });
    })
}


module.exports.connectChat = connectChat;