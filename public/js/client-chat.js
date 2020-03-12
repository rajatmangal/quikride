const socket = io();


const id = document.getElementsByTagName("body")[0].className;
// console.log("Id is" ,id);
const formData = document.getElementById("formData");
const messageField =  document.getElementById("message");
const sendMessage = document.getElementById("sendMessage");
const sendLoc = document.getElementById("sendLoc");
const messages = document.getElementById("messages");
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationTemplate = document.getElementById("location-template").innerHTML;
const username = document.getElementById("username").innerText;
// console.log("UserId is", username);
messages.scrollTop = messages.scrollHeight - messages.clientHeight;

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        time: moment(message.createdAt).format('MMMM Do YYYY h:mm a'),
        user: message.username
    });
    messages.insertAdjacentHTML('beforeend',html)
    messages.scrollTop = messages.scrollHeight - messages.clientHeight;
})

socket.on('locationMessage', (link) => {
    // console.log(link)
    const html = Mustache.render(locationTemplate, {
        url:link.url,
        time: moment(link.createdAt).format('MMMM Do YYYY h:mm a'),
        user: link.username
    });
    messages.insertAdjacentHTML('beforeend',html)
    messages.scrollTop = messages.scrollHeight - messages.clientHeight;
});

formData.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageField.value;
    if(message.length > 0) {
        sendMessage.setAttribute('disabled','disabled');
        sendLoc.setAttribute('disabled','disabled');
        socket.emit("sendMessage", {
            message: message,
            username:username,
            id:id
        },  (message) => {
            // console.log("Message has been delivered", message)
            sendMessage.removeAttribute('disabled');
            messageField.value = "";
            messageField.focus();
            sendLoc.removeAttribute('disabled');
        });
    }
});

sendLoc.addEventListener('click', (e) => {
    if( !navigator.geolocation ) {
        return alert('Geolocation is not supported by your browser.')
    }
    navigator.geolocation.getCurrentPosition( (position) => {
        // console.log("start");
        sendMessage.setAttribute('disabled','disabled');
        sendLoc.setAttribute('disabled','disabled');
        socket.emit('location', {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            username:username,
            id:id
        }, (message) => {
            // console.log(message);
            // console.log("start");
            sendMessage.removeAttribute('disabled');
            sendLoc.removeAttribute('disabled');
        })
    });
});
socket.emit("read", {
    id: id,
    username: username
 });


socket.emit("join", {room:id});