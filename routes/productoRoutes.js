const express = require('express');
const router = express.Router();
const Producto = require('../models/ProductoServicio');

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).send(producto);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).send(productos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!producto) {
      return res.status(404).send({ error: 'Producto no encontrado' });
    }
    res.send(producto);
  } catch (error) {
    res.status(400).send({ error: 'Error al actualizar el producto', details: error.message });
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).send({ error: 'Producto no encontrado' });
    }
    res.send({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(400).send({ error: 'Error al eliminar el producto', details: error.message });
  }
});



module.exports = router;
