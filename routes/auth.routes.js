const express = require('express');
const router = express.Router();

// Aquí puedes importar tu controlador (auth.controller.js) y usarlo

router.post('/login', (req, res) => {
  // Lógica de login aquí
  res.json({ message: 'Ruta login funcionando' });
});

module.exports = router;








