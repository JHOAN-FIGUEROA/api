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

module.exports = router;
