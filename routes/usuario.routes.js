const Usuario = require('./models/usuario.model'); // Asegúrate de importar tu modelo
const bcrypt = require('bcrypt');

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
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});


