var User = require("../models/user");
const generateMessage = (message) => {
    return {
        text: message.message,
        createdAt: new Date().getTime(),
        username: message.username
    }
}

const generateLink = (coords) => {
    let url = `http://google.com/maps?q=${coords.lat},${coords.lon}`;
    return {
        url: url,
        createdAt: new Date().getTime(),
        username: coords.username
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
    if(res2.length > 4) {
        sender = res2.slice(0,4);
    } 
    console.log(sender);
    for(var k = 0 ; k < sender.length ; k++) {
        let count = 0;
        if(sender[k].last_message === "") {
            sender.splice(k, 1)
            k--;
        } else{
            for(var j = 0 ; j < sender[k].users.length ; j++) {
                if(sender[k].users[j] != user) {
                    sender[k].last_sender = sender[k].users[j];
                    count++;
                }
            }
            var id = await User.findOne({username: sender[k].last_sender}, (err,user) => {
                if(err) throw err;
            })
            console.log(id)
            sender[k].id = id._id.toString();
            if(count == 0) {
                sender[k].lastsender = "You";
            }
        }
    }
    return sender;
}
module.exports = {
    generateMessage,
    generateLink,
    generateMessages
}