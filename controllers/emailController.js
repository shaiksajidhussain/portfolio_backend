const nodemailer = require('nodemailer');
const { EMAIL, EMAIL_PASSWORD } = require('../config/secrets');

const MAIL = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user: EMAIL,
    pass: EMAIL_PASSWORD,
};

const transporter = nodemailer.createTransport({
    host: MAIL.host,
    port: MAIL.port,
    secure: MAIL.secure,
    auth: {
        user: MAIL.user,
        pass: MAIL.pass,
    },
});

exports.sendEmail = async (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: MAIL.user,
        replyTo: email,
        to: MAIL.user,
        subject: `Portfolio Contact from ${name}`,
        text: `
Name: ${name}
Email: ${email}
Message: ${message}
        `,
        html: `
<div style="padding: 20px; background-color: #f5f5f5;">
    <h2 style="color: #854CE6;">New Contact Message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
</div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};
