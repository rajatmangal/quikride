var User = require("../models/user");
const generateMessage = (message) => {
    return {
        text: message.message,
        createdAt: new Date().getTime(),
        username: message.username,
        id: message.id
    }
}

const generateLink = (coords) => {
    let url = `http://google.com/maps?q=${coords.lat},${coords.lon}`;
    return {
        url: url,
        createdAt: new Date().getTime(),
        username: coords.username,
        id: coords.id
    }
}

const generateMessages = async (res2, user) => {
    function compare(a,b) {
        let comparison = 0;
        if (a.last_updated >= b.last_updated) {
            comparison = -1;
        } else if (a.last_updated < b.last_updated) {
            comparison = 1;
        }
        return comparison;
    }
    res2.sort(compare);
    var sender = res2;
    for(var k = 0 ; k < sender.length ; k++) {
        let count = 0;
        if(sender[k].last_message === "") {
            sender.splice(k, 1)
            k--;
        } else{
            for(var j = 0 ; j < sender[k].users.length ; j++) {
                if(sender[k].users[j] != user) {
                    sender[k].users[0] = sender[k].users[j];
                    count++;
                }
            }
            var id = await User.findOne({username: sender[k].users[0]}, (err,user) => {
                if(err) throw err;
            })
            sender[k].id = id._id.toString();
            if(count == 0) {
                sender[k].users[0] = "You";
            }
        }
    }
    return sender;
}
const unreadMessages = async (res2, user) => {
    var unread = 0;
    for(var k = 0 ; k < res2.length ; k++) {
        if(!res2[k].message_read && res2[k].last_sender != user) {
            unread += 1;
        }
    }
    return unread;
}
module.exports = {
    generateMessage,
    generateLink,
    generateMessages,
    unreadMessages
}