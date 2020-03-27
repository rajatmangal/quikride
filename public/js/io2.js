const socket = io();
const id = document.getElementById("username").innerText;

socket.emit('join',{room:id})