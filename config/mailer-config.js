const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'quikride123@gmail.com',
      pass: 'Vroomvroom$$$'
    }
});

module.exports = {
    sendEmail(from, to, subject, html) {
        return new Promise((resolve, reject) => {
            transporter.sendMail({from, subject, to, html}, (err, info) =>{
                if (err) {
                    reject(err);
                }
                resolve(info);
            });
        });
    }
}