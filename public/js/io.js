const socket = io();


function fillMessages(length, messages2) {
    for(let i = 0 ; i < length ; i++) {
        messages2.innerHTML += `
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
}


const id = document.getElementById("username").innerText;
var additionalMessages = document.getElementById("additionalMessages");
var messages = document.getElementById('messages');
var read = document.getElementById('readMore');
additionalMessages.style.display = 'none';

// socket.emit("user", {
//     user:user
// });
socket.emit('join',{room:id})

socket.on('message', (message) => {
    console.log("hi")
    console.log(message.messages);
    messages.innerHTML = "";
    var messagesLength = message.messages.length;
    if(messagesLength > 4) {
        fillMessages(4, messages);
        fillMessages(messagesLength - 4, additionalMessages);
        read.style.display = "block";
    } else {
        fillMessages(messagesLength, messages)
        read.style.display = "none";
    }
    
})


read.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    additionalMessages.style.display = 'block';
    read.style.display = 'none';
})