const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'bhaveshgautam2302@gmail.com',
    pass: 'wkdfnlaasjnoxfod',
  },
});
module.exports = transporter