const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// Obtener todos los productos
router.get('/', productosController.getProductos);

// Obtener un producto por ID
router.get('/:id', productosController.getProductoById);

// Crear un nuevo producto
router.post('/', productosController.createProducto);

// Actualizar un producto por ID
router.put('/:id', productosController.updateProducto);

// Eliminar un producto por ID
router.delete('/:id', productosController.deleteProducto);

module.exports = router;

