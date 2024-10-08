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
    console.error('Error al obtener los clientes:', error);
    res.status(500).send({ error: 'Error al obtener los clientes' });
  }
});

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).send({ error: 'Cliente no encontrado' });
    }
    res.status(200).send(cliente);
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    res.status(500).send({ error: 'Error al obtener el cliente' });
  }
});

// Actualizar un cliente
router.put('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cliente) {
      return res.status(404).send({ error: 'Cliente no encontrado' });
    }
    res.status(200).send(cliente);
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    res.status(400).send({ error: 'Error al actualizar el cliente' });
  }
});

// Eliminar un cliente
router.delete('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).send({ error: 'Cliente no encontrado' });
    }
    res.status(200).send({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    res.status(500).send({ error: 'Error al eliminar el cliente' });
  }
});

module.exports = router;

