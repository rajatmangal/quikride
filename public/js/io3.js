const socket = io();
const username = document.getElementById("username").innerText;
console.log("Joined IO");
var element = document.getElementById("btnsubmit");
var id = document.getElementById("groupId").value;
console.log(id)
function message(message) {
    socket.emit("sendMessage", {
        message: message,
        username:username,
        id:id
    },  (message) => {
        // console.log("Message has been delivered", message)
    });
}

element.addEventListener('click', () => {
    var form = document.getElementById("form");
    message("Hey I saw ur post. I have created a new request for the ride. Please have a look.");
    form.submit();
})