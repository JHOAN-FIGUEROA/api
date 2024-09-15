const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario'); // Asegúrate de que la ruta al modelo sea correcta
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Asegúrate de tener una clave secreta en tu archivo .env

// Ruta para registrar un nuevo usuario
router.post('/registro', async (req, res) => {
  try {
    const { nombre, correo, telefono, contraseña, confirmarContraseña } = req.body;

    // Validar que las contraseñas coincidan
    if (contraseña !== confirmarContraseña) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
    }

    // Crear un nuevo usuario
    const nuevoUsuario = new Usuario({ nombre, correo, telefono, contraseña, confirmarContraseña });
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Buscar el usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ error: 'Correo electrónico o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const esCoincide = await usuario.comparePassword(contraseña);
    if (!esCoincide) {
      return res.status(400).json({ error: 'Correo electrónico o contraseña incorrectos' });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;

