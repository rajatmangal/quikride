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
        message("Your ride request has been approved by "+username+". Please go to your ride history to check details.", element.name);
        form.action = "/accept/"+ form.className;
        form.submit();
    })
    element2.addEventListener('click', () => {
        message("Your ride request has been declined by "+username+". Please go to your ride history to check details.", element2.name);
        form.action = "/reject/"+ form.className;
        form.submit();
    })
}

// formData.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const message = messageField.value;
//     if(message.length > 0) {
//         sendMessage.setAttribute('disabled','disabled');
//         sendLoc.setAttribute('disabled','disabled');
//         socket.emit("sendMessage", {
//             message: message,
//             username:username,
//             id:id
//         },  (message) => {
//             // console.log("Message has been delivered", message)
//             sendMessage.removeAttribute('disabled');
//             messageField.value = "";
//             messageField.focus();
//             sendLoc.removeAttribute('disabled');
//         });
//     }
// });