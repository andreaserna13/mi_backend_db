// controllers/auth.controller.js

async function login(req, res) {
  const { nombre, clave, tipoUsuario } = req.body;

  if (!nombre || !clave || !tipoUsuario) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

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

  return res.status(401).json({ mensaje: 'Credenciales inválidas' });
}

async function enviarCorreoRecuperacion(req, res) {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: 'El correo es obligatorio' });
  }

  // Simula envío de correo
  console.log(`Simulando envío de correo de recuperación a ${correo}`);
  return res.json({ mensaje: 'Correo de recuperación enviado correctamente' });
}

module.exports = {
  login,
  enviarCorreoRecuperacion
};







