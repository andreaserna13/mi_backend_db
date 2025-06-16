// controllers/auth.controller.js
// En backend/controllers/auth.controller.js
const Usuario = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { nombre, clave, tipoUsuario } = req.body;
  const usuario = await Usuario.findOne({ where: { nombre, tipoUsuario } });

  if (!usuario) {
    return res.status(401).json({ exito: false, mensaje: 'Usuario no encontrado' });
  }

  const claveValida = await bcrypt.compare(clave, usuario.clave);
  if (!claveValida) {
    return res.status(401).json({ exito: false, mensaje: 'Clave incorrecta' });
  }

  return res.json({
    exito: true,
    token: 'token-simulado',
    usuario: { tipoUsuario: usuario.tipoUsuario, nombre: usuario.nombre },
    mensaje: 'Login exitoso'
  });
};

exports.registro = async (req, res) => {
  const { nombre, clave, tipoUsuario } = req.body;
  const hash = await bcrypt.hash(clave, 10);

  try {
    await Usuario.create({ nombre, clave: hash, tipoUsuario });
    res.json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al registrar usuario', error });
  }
};

exports.enviarCorreoRecuperacion = async (req, res) => {
  const { correo } = req.body;

  if (!correo) return res.status(400).json({ mensaje: 'Correo requerido' });

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.CORREO_APP,
      pass: process.env.CORREO_CLAVE
    }
  });

  const mailOptions = {
    from: process.env.CORREO_APP,
    to: correo,
    subject: 'Recuperación de contraseña',
    text: 'Haz clic en el enlace para restablecer tu contraseña: http://tuapp.com/recuperar'
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ mensaje: 'Correo de recuperación enviado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al enviar correo', error });
  }
};











