const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.CORREO_APP,
    pass: process.env.CORREO_CLAVE,
  },
});

async function enviarCorreoRecuperacion(emailDestino, token) {
  const linkRecuperacion = `http://localhost:5173/nueva-contrasena?token=${token}`; // Cambia el link al front donde cambiarán la contraseña

  const mailOptions = {
    from: process.env.CORREO_APP,
    to: emailDestino,
    subject: 'Recuperación de contraseña',
    html: `<p>Haz clic <a href="${linkRecuperacion}">aquí</a> para restablecer tu contraseña.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { enviarCorreoRecuperacion };



