const express = require('express');
const router = express.Router();
const {
  getCompras,
  createCompra,
  getCompraById,
  updateCompra,
  anularCompra
} = require('../controllers/compraController');

// Obtener todas las compras
router.get('/', async (req, res) => {
  try {
    const compras = await getCompras();
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las compras.' });
  }
});

// Crear una nueva compra
router.post('/', async (req, res) => {
  try {
    const nuevaCompra = await createCompra(req.body);
    res.status(201).json(nuevaCompra);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la compra.' });
  }
});

// Obtener una compra por ID
router.get('/:id', async (req, res) => {
  try {
    const compra = await getCompraById(req.params.id);
    if (compra) {
      res.json(compra);
    } else {
      res.status(404).json({ message: 'Compra no encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la compra.' });
  }
});

// Actualizar una compra existente
router.put('/:id', async (req, res) => {
  try {
    const compraActualizada = await updateCompra(req.params.id, req.body);
    if (compraActualizada) {
      res.json(compraActualizada);
    } else {
      res.status(404).json({ message: 'Compra no encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la compra.' });
  }
});

// Anular una compra existente
router.patch('/:id/anular', async (req, res) => {
  try {
    const compraAnulada = await anularCompra(req.params.id);
    if (compraAnulada) {
      res.json(compraAnulada);
    } else {
      res.status(404).json({ message: 'Compra no encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al anular la compra.' });
  }
});

module.exports = router;
