const socket = io();


socket.on('message', (message) => {
    console.log(message);
})
document.getElementById("formData").addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById("message").value;
    socket.emit("sendMessage", message);
});

document.getElementById("sendLoc").addEventListener('click', (e) => {
    if( !navigator.geolocation ) {
        return alert('Geolocation is not supported by your browser.')
    }
    navigator.geolocation.getCurrentPosition( (position) => {
        socket.emit('location', {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        })
    });
});