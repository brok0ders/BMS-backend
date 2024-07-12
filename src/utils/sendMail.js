import nodemailer from "nodemailer";
export const sendMail = async ({ emails, total, name, billNo, url }) => {
  try {
    // Configure nodemailer to send email
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: emails.join(","),
      subject: "New Bill Created",
      html: `
    <html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bill Creation Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f6f6;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #f1f1f1;
            color: #666666;
            text-align: center;
            padding: 10px;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bill Created</h1>
        </div>
        <div class="content">
            <p>Dear, ${name},</p>
            <p>We are pleased to inform you that a new bill of ₹${total} amount has been created from your account.</p>
            <p>Here are the details:</p>
            <ul>
                <li><strong>Bill Number:</strong> ${billNo}</li>
                <li><strong>Date:</strong> ${date}</li>
                <li><strong>Amount:</strong> ${total}</li>
            </ul>
            <p>If you did not authorize this transaction, please contact our support team immediately.</p>
            <p>Thank you for using our service.</p>
            <p>Best regards,</p>
            <p>Bottlers</p>
            <a href=${url} class="button">View Bill</a>
        </div>
        <div class="footer">
            <p>&copy; ${Date(
              new Date().getFullYear
            )} Bottlers. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `,
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
