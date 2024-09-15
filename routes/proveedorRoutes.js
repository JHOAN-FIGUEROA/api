const express = require('express');
const router = express.Router();
const Proveedor = require('../models/Proveedor');

// Crear un nuevo proveedor
router.post('/', async (req, res) => {
  try {
    const proveedor = new Proveedor(req.body);
    await proveedor.save();
    res.status(201).send(proveedor);
  } catch (error) {
    res.status(400).send({ error: 'No se pudo crear el proveedor' });
  }
});

// Obtener todos los proveedores
router.get('/', async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.status(200).send(proveedores);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los proveedores' });
  }
});

// Obtener un proveedor por ID
router.get('/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) {
      return res.status(404).send({ error: 'Proveedor no encontrado' });
    }
    res.status(200).send(proveedor);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener el proveedor' });
  }
});

// Actualizar un proveedor
router.put('/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!proveedor) {
      return res.status(404).send({ error: 'Proveedor no encontrado' });
    }
    res.status(200).send(proveedor);
  } catch (error) {
    res.status(400).send({ error: 'Error al actualizar el proveedor' });
  }
});

// Eliminar un proveedor
router.delete('/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findByIdAndDelete(req.params.id);
    if (!proveedor) {
      return res.status(404).send({ error: 'Proveedor no encontrado' });
    }
    res.status(200).send({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar el proveedor' });
  }
});

module.exports = router;

