const express = require('express');
const router = express.Router();
const { login, enviarCorreoRecuperacion, registro } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/recuperar', enviarCorreoRecuperacion);
router.post('/registro', registro);

module.exports = router;


















