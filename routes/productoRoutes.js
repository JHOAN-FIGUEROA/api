const express = require('express');
const router = express.Router();
const ProductoServicio = require('../models/ProductoServicio');

// Obtener todos los productos/servicios
router.get('/', async (req, res) => {
  try {
    const productosServicios = await ProductoServicio.find();
    res.status(200).send(productosServicios);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los productos/servicios', details: error.message });
  }
});

// Obtener un producto/servicio por ID
router.get('/:id', async (req, res) => {
  try {
    const productoServicio = await ProductoServicio.findById(req.params.id);
    if (!productoServicio) {
      return res.status(404).send({ error: 'Producto/Servicio no encontrado' });
    }
    res.status(200).send(productoServicio);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener el producto/servicio', details: error.message });
  }
});

// Crear un nuevo producto/servicio
router.post('/', async (req, res) => {
  try {
    const productoServicio = new ProductoServicio(req.body);
    await productoServicio.save();
    res.status(201).send(productoServicio);
  } catch (error) {
    res.status(400).send({ error: 'Error al crear el producto/servicio', details: error.message });
  }
});

// Actualizar un producto/servicio existente
router.put('/:id', async (req, res) => {
  try {
    const productoServicio = await ProductoServicio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!productoServicio) {
      return res.status(404).send({ error: 'Producto/Servicio no encontrado' });
    }
    res.status(200).send(productoServicio);
  } catch (error) {
    res.status(400).send({ error: 'Error al actualizar el producto/servicio', details: error.message });
  }
});

// Eliminar un producto/servicio (puede ser marcado como inactivo en lugar de eliminar)
router.delete('/:id', async (req, res) => {
  try {
    const productoServicio = await ProductoServicio.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    if (!productoServicio) {
      return res.status(404).send({ error: 'Producto/Servicio no encontrado' });
    }
    res.status(200).send(productoServicio);
  } catch (error) {
    res.status(400).send({ error: 'Error al eliminar el producto/servicio', details: error.message });
  }
});

module.exports = router;
