const express = require('express');
const router = express.Router();
const { getVentas, createVenta, getVentaById, updateVenta, anularVenta } = require('../controllers/ventaController');

// Rutas
router.get('/', getVentas);
router.post('/', createVenta);
router.get('/:id', getVentaById);
router.put('/:id', updateVenta);
router.patch('/:id/anular', anularVenta);  // Ruta para anular la venta

module.exports = router;
