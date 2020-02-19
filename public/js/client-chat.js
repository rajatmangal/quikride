const socket = io();

const formData = document.getElementById("formData");
const messageField =  document.getElementById("message");
const sendMessage = document.getElementById("sendMessage");
const sendLoc = document.getElementById("sendLoc");
const messages = document.getElementById("messages");
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationTemplate = document.getElementById("location-template").innerHTML;

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        time: moment(message.createdAt).format('dddd h:mm a')
    });
    messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage', (link) => {
    // console.log(link)
    const html = Mustache.render(locationTemplate, {
        url:link.url,
        time: moment(link.createdAt).format('dddd h:mm a')
    });
    messages.insertAdjacentHTML('beforeend',html)
});

formData.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage.setAttribute('disabled','disabled');
    sendLoc.setAttribute('disabled','disabled');
    const message = messageField.value;
    socket.emit("sendMessage", message, (message) => {
        console.log("Message has been delivered", message)
        sendMessage.removeAttribute('disabled');
        messageField.value = "";
        messageField.focus();
        sendLoc.removeAttribute('disabled');
    });
});

sendLoc.addEventListener('click', (e) => {
    if( !navigator.geolocation ) {
        return alert('Geolocation is not supported by your browser.')
    }
    navigator.geolocation.getCurrentPosition( (position) => {
        console.log("start");
        sendMessage.setAttribute('disabled','disabled');
        sendLoc.setAttribute('disabled','disabled');
        socket.emit('location', {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }, (message) => {
            console.log(message);
            console.log("start");
            sendMessage.removeAttribute('disabled');
            sendLoc.removeAttribute('disabled');
        })
    });
});