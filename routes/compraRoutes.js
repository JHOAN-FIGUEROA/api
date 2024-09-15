const express = require('express');
const router = express.Router();
const { getCompras, createCompra, getCompraById, updateCompra, anularCompra } = require('../controllers/compraController');

// Rutas
router.get('/', getCompras);
router.post('/', createCompra);
router.get('/:id', getCompraById);
router.put('/:id', updateCompra);
router.patch('/:id/anular', anularCompra);  // Ruta para anular la compra

module.exports = router;
