const Compra = require('../models/Compra');

// Obtener todas las compras
const getCompras = async (req, res) => {
  try {
    const compras = await Compra.find();
    res.status(200).json(compras);
  } catch (error) {
    console.error('Error al obtener las compras:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al obtener las compras' });
    }
  }
};

// Crear una nueva compra
const createCompra = async (req, res) => {
  try {
    const nuevaCompra = new Compra(req.body);
    await nuevaCompra.save();
    if (!res.headersSent) {
      res.status(201).json(nuevaCompra);
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({ message: 'Error al crear la compra', details: error.message });
    }
  }
};

// Obtener una compra por ID
const getCompraById = async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id);
    if (!compra) {
      if (!res.headersSent) {
        res.status(404).json({ message: 'Compra no encontrada' });
      }
    } else {
      if (!res.headersSent) {
        res.status(200).json(compra);
      }
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al obtener la compra', details: error.message });
    }
  }
};

// Actualizar una compra
const updateCompra = async (req, res) => {
  try {
    const compraActualizada = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!compraActualizada) {
      if (!res.headersSent) {
        res.status(404).json({ message: 'Compra no encontrada' });
      }
    } else {
      if (!res.headersSent) {
        res.status(200).json(compraActualizada);
      }
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al actualizar la compra', details: error.message });
    }
  }
};

// Eliminar una compra
const deleteCompra = async (req, res) => {
  try {
    const compraEliminada = await Compra.findByIdAndDelete(req.params.id);
    if (!compraEliminada) {
      if (!res.headersSent) {
        res.status(404).json({ message: 'Compra no encontrada' });
      }
    } else {
      if (!res.headersSent) {
        res.status(200).json({ message: 'Compra eliminada correctamente' });
      }
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al eliminar la compra', details: error.message });
    }
  }
};

// Anular una compra
const anularCompra = async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id);
    if (!compra) {
      if (!res.headersSent) {
        res.status(404).json({ message: 'Compra no encontrada' });
      }
    } else {
      compra.anulado = true;
      const compraAnulada = await compra.save();
      if (!res.headersSent) {
        res.status(200).json(compraAnulada);
      }
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al anular la compra', details: error.message });
    }
  }
};

module.exports = { getCompras, createCompra, getCompraById, updateCompra, deleteCompra, anularCompra };



