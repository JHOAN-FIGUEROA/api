const express = require('express');
const router = express.Router();
const Compra = require('../models/Compra');

// Obtener todas las compras
router.get('/', async (req, res) => {
  try {
    const compras = await Compra.find();
    res.status(200).send(compras);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener las compras', details: error.message });
  }
});

// Crear una nueva compra
router.post('/', async (req, res) => {
  try {
    const compra = new Compra(req.body);
    await compra.save();
    res.status(201).send(compra);
  } catch (error) {
    res.status(400).send({ error: 'Error al crear la compra', details: error.message });
  }
});

// Obtener una compra por ID
router.get('/:id', async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id);
    if (!compra) {
      return res.status(404).send({ error: 'Compra no encontrada' });
    }
    res.status(200).send(compra);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener la compra', details: error.message });
  }
});

// Actualizar una compra existente
router.put('/:id', async (req, res) => {
  try {
    const compra = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!compra) {
      return res.status(404).send({ error: 'Compra no encontrada' });
    }
    res.status(200).send(compra);
  } catch (error) {
    res.status(400).send({ error: 'Error al actualizar la compra', details: error.message });
  }
});

// Anular una compra existente
router.patch('/:id/anular', async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id);
    if (!compra) {
      return res.status(404).send({ error: 'Compra no encontrada' });
    }
    compra.anulado = true; 
    await compra.save();
    res.status(200).send(compra);
  } catch (error) {
    res.status(500).send({ error: 'Error al anular la compra', details: error.message });
  }
});

module.exports = router;
