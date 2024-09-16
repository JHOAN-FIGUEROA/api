const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await productosController.getProductos();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await productosController.getProductoById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = await productosController.createProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto', error: error.message });
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const productoActualizado = await productosController.updateProducto(req.params.id, req.body);
    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto', error: error.message });
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const productoEliminado = await productosController.deleteProducto(req.params.id);
    if (!productoEliminado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
});

module.exports = router;
