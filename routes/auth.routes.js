// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { login, enviarCorreoRecuperacion } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/recuperar', enviarCorreoRecuperacion);

module.exports = router;














