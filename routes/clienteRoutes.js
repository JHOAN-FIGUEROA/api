const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Crear un nuevo cliente
router.post('/', async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).send(cliente);
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(400).send({ error: 'Error al crear el cliente' });
  }
});



// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).send(clientes);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
