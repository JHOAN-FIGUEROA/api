// routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProductos,
  createProducto,
  getProductoById,
  updateProducto,
  deleteProducto
} = require('../controllers/productoController');

// Obtener todos los productos
router.get('/Productos', getProductos);

// Crear un nuevo producto
router.post('/Productos', createProducto);

// Obtener un producto por ID
router.get('/Productos/:id', getProductoById);

// Actualizar un producto
router.put('/Productos/:id', updateProducto);

// Eliminar un producto
router.delete('/Productos/:id', deleteProducto);

module.exports = router;

