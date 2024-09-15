const express = require('express');
const Proveedor = require('../models/Proveedor');
const router = express.Router();

// Ruta para crear un proveedor
router.post('/proveedores', async (req, res) => {
  try {
    const proveedor = new Proveedor(req.body);
    await proveedor.save();
    res.status(201).send(proveedor);
  } catch (error) {
    res.status(400).send({ error: 'No se pudo crear el proveedor' });
  }
});

module.exports = router;
