require('dotenv').config();
const nodemailer = require('nodemailer');

const recuperarContrasena = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: 'El correo es obligatorio' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CORREO_APP,
      pass: process.env.CORREO_CLAVE,
    },
  });

  const mailOptions = {
    from: process.env.CORREO_APP,
    to: correo,
    subject: 'Recuperación de contraseña',
    text: 'Haz clic en este enlace para recuperar tu contraseña: http://tuapp.com/recuperar',
    // Puedes poner aquí un enlace real de recuperación
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ mensaje: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return res.status(500).json({ mensaje: 'Error al enviar el correo' });
  }
};

module.exports = { recuperarContrasena };
