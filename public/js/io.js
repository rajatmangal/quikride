const socket = io();

const id = document.getElementById("username").innerText;
// socket.emit("user", {
//     user:user
// });
socket.emit('join',{room:id})

socket.on('message', (message) => {
    console.log(message);
})