const socket = io();
const username = document.getElementById("username").innerText;
const requests = document.getElementById("total").innerText;
console.log(requests);
console.log("Joined IO");

function message(message, id) {
    socket.emit("sendMessage", {
        message: message,
        username:username,
        id:id
    },  (message) => {
        // console.log("Message has been delivered", message)
    });
}

for(var i = 0 ; i < requests ; i++) {
    form = document.getElementById("form");
    element = document.getElementById("accept" + i);
    element2 = document.getElementById("reject" + i);
    element.addEventListener('click', () => {
        message("Hey I have approved the request. See u then . Please go to your ride history to check details.", element.name);
        form.action = "/accept/"+ form.className;
        form.submit();
    })
    element2.addEventListener('click', () => {
        message("Sorry, I can't approve your request. Please go to your ride history to check details.", element2.name);
        form.action = "/reject/"+ form.className;
        form.submit();
    })
}