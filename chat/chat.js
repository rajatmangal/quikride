const socketIO = require('socket.io');
const chatUtil = require('./chat-utils')
const messages = require('../models/messages');
const thread = require('../models/thread');
const user = require('../models/user');
const mongoose = require('mongoose');
const moment = require('moment');

function connectChat(server) {
    const io = socketIO(server);
    io.on('connection', (socket) => {
        socket.on('join', (id) => {
            socket.join(id.room);
            //io.to.emit (send message to everyone in room)
            //socket.broadcast.to.emit (send message to everyone in room except yourself)
            // socket.emit('message', chatUtil.generateMessage("Welcome!"));
            // socket.broadcast.to(id).emit('message', chatUtil.generateMessage("A new user has joined"));
            //io.to(id).emit('message', chatUtil.generateMessage("A new user has joined"));
        })
        socket.on('sendMessage', (message, callback) => {
            var newMessage = new messages({ sender: message.username, message:message.message, thread: message.id, created_at: new Date().getTime()});
            messages.create(newMessage, (err,res) => {
                 if(err) {
                     throw err;
                 }
                 else {
                    thread.update({group_name: message.id},{$set: {last_updated: new Date().getTime(), last_message: message.message, last_sender: message.username, message_read: false}}, async function(err, result) {
                        if(err) {
                            throw err;
                        }
                        else {
                            socket.join(message.id);
                            io.to(message.id).emit('message', chatUtil.generateMessage(message));
                            const receiver = await thread.find({group_name: message.id}, (err,res) => {
                                if(err) {
                                    throw err;
                                }
                            });
                            for(let i = 0; i < receiver[0].users.length; i++) {
                                if(receiver[0].users[i] !== message.username) {
                                    thread.find({ users: receiver[0].users[i]}, async (err,res2) => {
                                        if(res2 != null) {
                                            var sender = await chatUtil.generateMessages(res2,receiver[0].users[i]);
                                            io.to(receiver[0].users[i]).emit('message', {messages:sender, moment:moment})
                                        }
                                    });
                                }
                            }
                            //send this to the other member of the group
                            
                            // io.emit
                            callback("Delivered");
                        }
                    }); 
                 }
             });
        });
        
        socket.on('location', (coords, callback) => {
            let url = `http://google.com/maps?q=${coords.lat},${coords.lon}`;
            var newMessage = new messages({ sender: coords.username, message: url, thread: coords.id, created_at: new Date().getTime()});
            messages.create(newMessage, (err,res) => {
                 if(err) {
                     throw err;
                 }
                 else {
                    thread.update({group_name: coords.id},{$set: {last_updated: new Date().getTime(), last_message: url, last_sender: coords.username, message_read: false}}, function(err, result) {
                        if(err) {
                            throw err;
                        }
                        else {
                            socket.join(coords.id);
                            io.to(coords.id).emit('locationMessage', chatUtil.generateLink(coords));
                            callback('Location Shared');
                        }
                    });
                }
             });
            
        });

        socket.on("read", (id) => {
            thread.find({group_name: id.id} , async (err, res) => {
                if(err) throw err;
                if(res[0].last_sender !== id.username) {
                    await thread.updateOne({group_name: id.id},{$set: {message_read: true}}, function(err, result) {
                        if(err) throw err;
                    });
                }
            })
        })
        // socket.on('user', async (user) => {
        //     await thread.update({username: user},{$set: {socket_id: socket.id}}, function(err, result) {
        //         if(err) {
        //             throw err;
        //         }
        //         socket.emit("message",socket.id);
        //     });
        // })
        socket.on('disconnect', () => {
            // io.emit('message', chatUtil.generateMessage("A user has left"))
        });
    })
}


module.exports.connectChat = connectChat;