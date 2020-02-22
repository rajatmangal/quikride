
const generateMessage = (message) => {
    return {
        text: message.message,
        createdAt: new Date().getTime(),
        username: message.username
    }
}

const generateLink = (coords) => {
    let url = `http://google.com/maps?q=${coords.lat},${coords.lon}`;
    return {
        url: url,
        createdAt: new Date().getTime(),
        username: coords.username
    }
}

module.exports = {
    generateMessage,
    generateLink
}