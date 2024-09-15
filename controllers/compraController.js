const Compra = require('../models/Compra');

// Obtener todas las compras
const getCompras = async (req, res) => {
  try {
    const compras = await Compra.find();
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las compras' });
  }
};

// Crear una nueva compra
const createCompra = async (req, res) => {
  try {
    const nuevaCompra = new Compra(req.body);
    await nuevaCompra.save();
    res.status(201).json(nuevaCompra);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la compra' });
  }
};

// Obtener una compra por ID
const getCompraById = async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id);
    if (!compra) return res.status(404).json({ message: 'Compra no encontrada' });
    res.json(compra);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la compra' });
  }
};

// Actualizar una compra
const updateCompra = async (req, res) => {
  try {
    const compraActualizada = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(compraActualizada);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la compra' });
  }
};

// Anular una compra
const anularCompra = async (req, res) => {
  try {
    const compraAnulada = await Compra.findByIdAndUpdate(req.params.id, { estado: 'anulada' }, { new: true });
    if (!compraAnulada) return res.status(404).json({ message: 'Compra no encontrada' });
    res.json({ message: 'Compra anulada con éxito', compraAnulada });
  } catch (error) {
    res.status(500).json({ message: 'Error al anular la compra' });
  }
};

module.exports = { getCompras, createCompra, getCompraById, updateCompra, anularCompra };

