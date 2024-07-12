const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // Configure nodemailer to send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'brokoders@gmail.com', // Your email address
      pass: 'zmom rqeu lunm xkkb' // Your email password (not recommended, use environment variables)
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com', // Sender address
    to: 'your-email@gmail.com', // List of receivers (your email address)
    subject: 'New Message from Contact Form',
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error: Could not send email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
