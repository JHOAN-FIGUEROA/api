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
router.get('/Productos', async (req, res) => {
  try {
    await getProductos(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos.', error: error.message });
  }
});

// Crear un nuevo producto
router.post('/Productos', async (req, res) => {
  try {
    await createProducto(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto.', error: error.message });
  }
});

// Obtener un producto por ID
router.get('/Productos/:id', async (req, res) => {
  try {
    await getProductoById(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto.', error: error.message });
  }
});

// Actualizar un producto
router.put('/Productos/:id', async (req, res) => {
  try {
    await updateProducto(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto.', error: error.message });
  }
});

// Eliminar un producto
router.delete('/Productos/:id', async (req, res) => {
  try {
    await deleteProducto(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto.', error: error.message });
  }
});

module.exports = router;
