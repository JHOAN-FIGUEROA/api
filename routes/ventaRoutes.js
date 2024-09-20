const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Obtener todas las ventas
router.get('/', ventaController.getVentas);

// Obtener una venta por ID
router.get('/:id', ventaController.getVentaById);

// Crear una nueva venta
router.post('/', ventaController.createVenta);

// Actualizar una venta por ID
router.put('/:id', ventaController.updateVenta);

// Anular una venta por ID
router.delete('/:id', ventaController.deleteVenta);

module.exports = router;
