const express = require('express');
const router = express.Router();
const {
  getCompras,
  createCompra,
  getCompraById,
  updateCompra,
  anularCompra
} = require('../controllers/productoController');

// Obtener todas las compras
router.get('/', async (req, res) => {
  try {
    await getCompras(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las compras.' });
  }
});

// Crear una nueva compra
router.post('/', async (req, res) => {
  try {
    await createCompra(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la compra.' });
  }
});

// Obtener una compra por ID
router.get('/:id', async (req, res) => {
  try {
    await getCompraById(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la compra.' });
  }
});

// Actualizar una compra existente
router.put('/:id', async (req, res) => {
  try {
    await updateCompra(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la compra.' });
  }
});

// Anular una compra existente
router.patch('/:id/anular', async (req, res) => {
  try {
    await anularCompra(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al anular la compra.' });
  }
});

module.exports = router;
