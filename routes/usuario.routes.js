const express = require('express');
const router = express.Router();
const { registrar, iniciarSesion, recuperarPassword, cambiarPassword } = require('../controllers/auth.controller');

router.post('/registro', registrar);
router.post('/login', iniciarSesion);
router.post('/recuperar-contrasena', recuperarPassword);
router.post('/cambiar-contrasena', cambiarPassword);

module.exports = router;

