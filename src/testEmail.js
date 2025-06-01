require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CORREO_APP,
      pass: process.env.CORREO_CLAVE,
    },
  });

  const mailOptions = {
    from: process.env.CORREO_APP,
    to: process.env.CORREO_APP,  // envíate a ti mismo
    subject: 'Prueba de envío',
    text: 'Este es un correo de prueba desde nodemailer',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar correo:', error);
  }
}

sendTestEmail();
