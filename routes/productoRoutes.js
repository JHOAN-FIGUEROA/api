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
    res.status(400).send({ error: 'Error al crear el producto', details: error.message });
  }
});

@@ -19,11 +19,11 @@ router.get('/', async (req, res) => {
    const productos = await Producto.find();
    res.status(200).send(productos);
  } catch (error) {
    res.status(500).send(error);
    res.status(500).send({ error: 'Error al obtener los productos', details: error.message });
  }
});

// Actualizar un producto
// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
@@ -36,7 +36,7 @@ router.put('/:id', async (req, res) => {
  }
});

// Eliminar un producto
// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
@@ -49,6 +49,4 @@ router.delete('/:id', async (req, res) => {
  }
});



module.exports = router;
