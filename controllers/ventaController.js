const Venta = require('../models/Venta');

// Obtener todas las ventas
const getVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas' });
  }
};

// Crear una nueva venta
const createVenta = async (req, res) => {
  try {
    const nuevaVenta = new Venta(req.body);
    await nuevaVenta.save();
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la venta' });
  }
};

// Obtener una venta por ID
const getVentaById = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la venta' });
  }
};

// Actualizar una venta
const updateVenta = async (req, res) => {
  try {
    const ventaActualizada = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ventaActualizada);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la venta' });
  }
};

// Anular una venta
const anularVenta = async (req, res) => {
  try {
    const ventaAnulada = await Venta.findByIdAndUpdate(req.params.id, { estado: 'anulada' }, { new: true });
    if (!ventaAnulada) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json({ message: 'Venta anulada con éxito', ventaAnulada });
  } catch (error) {
    res.status(500).json({ message: 'Error al anular la venta' });
  }
};

module.exports = { getVentas, createVenta, getVentaById, updateVenta, anularVenta };
