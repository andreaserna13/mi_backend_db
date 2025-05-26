const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');

router.get('/iniciar-sesion', verifyToken, (req, res) => {
  res.send(`Ruta protegida, usuario id: ${req.userId}`);
});

module.exports = router;

