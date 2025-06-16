require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express(); // ✅ AHORA sí está antes de usar `app.use(...)`
const registroRoute = require('./routes/registro');

const PORT = process.env.PORT || 3001;

// Middleware para JSON y CORS
app.use(express.json());
app.use(cors());

// Ruta para registro
app.use('/api/usuario', registroRoute);

// Ruta para login (sin modificar)
app.post('/api/auth/login', (req, res) => {
  const { nombre, clave, tipoUsuario } = req.body;

  if (nombre === 'Andrea Serna Gil' && clave === '123456simon' && tipoUsuario === 'admin') {
    return res.json({
      exito: true,
      token: 'token-falso-admin',
      usuario: { tipoUsuario: 'admin', nombre },
      mensaje: 'Login exitoso como administrador',
    });
  }

  if (nombre === 'Julian Zapata' && clave === 'julian.1009' && tipoUsuario === 'usuario') {
    return res.json({
      exito: true,
      token: 'token-falso-usuario',
      usuario: { tipoUsuario: 'usuario', nombre },
      mensaje: 'Login exitoso como usuario',
    });
  }

  return res.status(401).json({
    exito: false,
    mensaje: 'Credenciales incorrectas',
  });
});

// Ruta para recuperación de contraseña
app.post('/api/auth/recuperar-contrasena', async (req, res) => {
  console.log('BODY RECIBIDO:', req.body);

  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: 'El correo es obligatorio' });
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
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
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    res.json({ mensaje: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ mensaje: 'Error al enviar el correo' });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});


