const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, clave, tipoUsuario } = req.body;

    if (!nombre || !clave || !tipoUsuario) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { nombre } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El nombre de usuario ya existe' });
    }

    const claveEncriptada = await bcrypt.hash(clave, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      clave: claveEncriptada,
      tipoUsuario,
    });

    res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuario: nuevoUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { registrarUsuario };
