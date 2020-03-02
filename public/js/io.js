const socket = io();

const id = document.getElementById("username").innerText;
// socket.emit("user", {
//     user:user
// });
socket.emit('join',{room:id})

socket.on('message', (message) => {
    console.log("hi")
    console.log(message.messages);
    var messages = document.getElementById('messages');
    messages.innerHTML = "";
    for(let i = 0 ; i < message.messages.length ; i++) {
        messages.innerHTML += `
            <a class="dropdown-item d-flex align-items-center" href="/chat/${message.messages[i].id}">
                <div class="dropdown-list-image mr-3">
                    <img class="rounded-circle" src="https://source.unsplash.com/fn_BT9fwg_E/60x60" alt="">
                    <div class="status-indicator bg-success"></div>
                </div>
                <div class="font-weight-bold">
                <div class="text-truncate">${message.messages[i].last_message}</div>
                <div class="small text-gray-500">${message.messages[i].last_sender} · ${moment(message.messages[i].last_updated).format('MMMM Do YYYY, h:mm:ss a')}</div>
                </div>
            </a>
        `;
    }
})