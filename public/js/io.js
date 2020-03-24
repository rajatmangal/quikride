const socket = io();
const id = document.getElementById("username").innerText;
var additionalMessages = document.getElementById("additionalMessages");
var messages = document.getElementById('messages');
var read = document.getElementById('readMore');
var unreadMessages = 0;

additionalMessages.style.display = 'none';
function fillMessages(length, messages2, message) {
    var m = "";
    for(let i = 0 ; i < length ; i++) {
        m += `
            <a class="dropdown-item d-flex align-items-center" href="/chat/${message.messages[i].id}">
                <div class="dropdown-list-image mr-3">
                    <img class="rounded-circle" src="https://image.shutterstock.com/image-vector/user-icon-trendy-flat-style-260nw-418179865.jpg" alt="">
                    <div class="status-indicator bg-success"></div>
                </div>
                <div class="font-weight-bold">
                <div class="text-truncate">`
        if(!message.messages[i].message_read && message.messages[i].last_sender !== id) {
            m+=`<span class="badge badge-pill badge-danger">New</span>`
        }
        m+=` 
                ${message.messages[i].last_message}  
                </div>
                <div class="small text-gray-500">${message.messages[i].last_sender} · ${moment(message.messages[i].last_updated).format('MMMM Do YYYY, h:mm:ss a')}</div>
                </div>
            </a>
        `;
        messages2.innerHTML = m;
        if(!message.messages[i].message_read && message.messages[i].last_sender !== id) {
            unreadMessages += 1;
        }
    }
}


// socket.emit("user", {
//     user:user
// });
socket.emit('join',{room:id})

socket.on('message', (message) => {
    // console.log(message.messages);
    messages.innerHTML = "";
    var messagesLength = message.messages.length;
    if(messagesLength > 4) {
        fillMessages(4, messages,message);
        fillMessages(messagesLength - 4, additionalMessages, message);
        read.style.display = "block";
    } else {
        fillMessages(messagesLength, messages, message)
        read.style.display = "none";
    }
    if(unreadMessages !== 0) {
        var badge = document.getElementById('badge');
        console.log(badge);
        badge.innerText = unreadMessages.toString();
        unreadMessages = 0
    }
    
})


read.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    additionalMessages.style.display = 'block';
    read.style.display = 'none';
})