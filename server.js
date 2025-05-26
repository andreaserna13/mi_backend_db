const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const app = express();

// ✅ Configuración de CORS (permite conexión desde el frontend)
app.use(cors({
  origin: 'http://localhost:5173', // Cambia el puerto si tu frontend usa otro
  credentials: true,
}));

// ✅ Middleware para recibir JSON
app.use(express.json());

// ✅ Conexión a la base de datos MySQL
const sequelize = new Sequelize('gestion', 'root', '123456simon', {
  host: 'localhost',
  dialect: 'mysql',
});

// ✅ Definición del modelo Usuario
const Usuario = sequelize.define('usuarios', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  dateCreated: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

// ✅ Ruta principal para comprobar el estado del servidor
app.get('/', (req, res) => {
  res.send('🚀 Servidor de backend funcionando correctamente');
});

// ✅ Ruta para iniciar sesión
app.post('/api/usuario/iniciar-sesion', async (req, res) => {
  const { nombre, contraseña } = req.body;

  if (!nombre || !contraseña) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { nombre } });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!match) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    if (usuario.estado !== 1) {
      return res.status(403).json({ mensaje: 'Usuario inactivo' });
    }

    res.json({ mensaje: 'Inicio de sesión exitoso', usuario: { nombre: usuario.nombre } });

  } catch (error) {
    console.error('Error en /api/usuario/iniciar-sesion:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ✅ Ruta para crear un nuevo usuario desde el frontend (opcional)
app.post('/api/usuario/registrar', async (req, res) => {
  const { nombre, contraseña } = req.body;

  if (!nombre || !contraseña) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      contraseña: hashedPassword,
      estado: 1,
    });

    res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    console.error('❌ Error al registrar el usuario:', error);
    res.status(500).json({ mensaje: 'Error interno al crear el usuario' });
  }
});

// ✅ Ruta para actualizar la contraseña de un usuario
app.put('/api/usuario/actualizar-password', async (req, res) => {
  const { nombre, nuevaPassword } = req.body;

  if (!nombre || !nuevaPassword) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    const resultado = await Usuario.update(
      { contraseña: hashedPassword },
      { where: { nombre } }
    );

    if (resultado[0] === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado para actualizar' });
    }

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error actualizando la contraseña:', error);
    res.status(500).json({ mensaje: 'Error al actualizar la contraseña' });
  }
});

// ✅ Iniciar el servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL');

    await Usuario.sync();
    console.log('✅ Modelo Usuario sincronizado');

    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
}

startServer();
