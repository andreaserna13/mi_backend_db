require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// === DB ===
const sequelize = require('./config/db');
const Usuario = require('./src/models/user.model');

// === Probar conexión DB ===
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a DB establecida'))
  .catch(err => console.error('❌ Error de conexión DB:', err));

// === Inicial usuarios.json (solo si lo quieres seguir usando) ===
let usuarios = [];
const USERS_FILE = './usuarios.json';

const cargarUsuarios = () => {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    usuarios = JSON.parse(data);
  } else {
    usuarios = [
      { nombre: 'Andrea Serna Gil', clave: '123456simon', tipoUsuario: 'admin' },
      { nombre: 'Julian Zapata', clave: 'julian.1009', tipoUsuario: 'usuario' }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));
  }
};

const guardarUsuarios = () => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));
};

cargarUsuarios();

// === Rutas ===

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

app.post('/api/auth/login', async (req, res) => {
  const { nombre, clave, tipoUsuario } = req.body;

  // Primero intentamos con la base de datos
  try {
    const usuarioDB = await Usuario.findOne({ where: { nombre, tipoUsuario } });
    if (usuarioDB) {
      const match = await bcrypt.compare(clave, usuarioDB.clave);
      if (match) {
        return res.json({
          exito: true,
          token: 'token-falso-' + tipoUsuario,
          usuario: { tipoUsuario: usuarioDB.tipoUsuario, nombre: usuarioDB.nombre },
          mensaje: `Login exitoso como ${tipoUsuario}`
        });
      }
    }
  } catch (err) {
    console.error('Error login DB:', err);
  }

  // Si no existe en DB, intenta con json (para mantener tu originalidad)
  const user = usuarios.find(
    u => u.nombre === nombre && u.clave === clave && u.tipoUsuario === tipoUsuario
  );

  if (user) {
    return res.json({
      exito: true,
      token: 'token-falso-' + tipoUsuario,
      usuario: { tipoUsuario: user.tipoUsuario, nombre: user.nombre },
      mensaje: `Login exitoso como ${tipoUsuario}`
    });
  }

  return res.status(401).json({
    exito: false,
    mensaje: 'Credenciales incorrectas'
  });
});

app.post('/api/auth/recuperar-contrasena', async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: 'El correo es obligatorio' });
  }

  try {
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
      text: 'Haz clic en el siguiente enlace para recuperar tu contraseña: http://tuapp.com/recuperar',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);

    res.json({ mensaje: 'Correo de recuperación enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ mensaje: 'Error al enviar el correo' });
  }
});

app.post('/api/usuario/registro', async (req, res) => {
  const { nombre, clave, tipoUsuario } = req.body;

  if (!nombre || !clave || !tipoUsuario) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const existe = await Usuario.findOne({ where: { nombre } });
    if (existe) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    const claveEncriptada = await bcrypt.hash(clave, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      clave: claveEncriptada,
      tipoUsuario
    });

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        tipoUsuario: nuevoUsuario.tipoUsuario
      }
    });
  } catch (error) {
    console.error('Error registro DB:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Listar usuarios (de JSON solo)
app.get('/api/usuario/lista', (req, res) => {
  res.json(usuarios);
});

// === Levantar servidor ===
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
