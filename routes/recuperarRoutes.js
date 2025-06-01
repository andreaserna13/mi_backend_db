const express = require('express');
const router = express.Router();

// Si tienes controlador para login
const { enviarCorreoRecuperacion } = require('../services/email.service');


// Ruta login
router.post('/login', login);

// Tu ruta recuperar contraseña existente
router.post('/recuperar-contrasena', async (req, res) => {
  // tu código de recuperación aquí
});

module.exports = router;



