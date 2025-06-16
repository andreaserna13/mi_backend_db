const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Ruta para registrar usuario
router.post('/registro', async (req, res) => {
  const { nombre, clave, tipoUsuario } = req.body;

  if (!nombre || !clave || !tipoUsuario) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const hash = await bcrypt.hash(clave, 10);

    pool.query(
      'INSERT INTO usuarios (nombre, clave, tipoUsuario) VALUES (?, ?, ?)',
      [nombre, hash, tipoUsuario],
      (err, results) => {
        if (err) {
          console.error('Error en la consulta:', err);
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El nombre ya está registrado' });
          }
          return res.status(500).json({ error: 'Error del servidor' });
        }

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
      }
    );
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;






