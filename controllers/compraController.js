const Compra = require('../models/Compra');
const ProductoServicio = require('../models/ProductoServicio'); // Asegúrate de que la ruta sea correcta

// Obtener todas las compras
const getCompras = async (req, res) => {
  try {
    const compras = await Compra.find();
    res.status(200).json(compras);
  } catch (error) {
    console.error('Error al obtener las compras:', error.message);
    res.status(500).json({ message: 'Error al obtener las compras' });
  }
};

// Crear una nueva compra
const createCompra = async (req, res) => {
  try {
    const nuevaCompra = new Compra(req.body);
    await nuevaCompra.save();
    
    // Obtener el producto usando el producto_servicio_id
    const producto = await ProductoServicio.findById(nuevaCompra.producto_servicio_id);
    if (producto) {
      await ProductoServicio.findByIdAndUpdate(producto._id, { cantidad: producto.cantidad + nuevaCompra.cantidad });
    } else {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.status(201).json(nuevaCompra);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la compra', details: error.message });
  }
};

// Obtener una compra por ID
const getCompraById = async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id);
    if (!compra) return res.status(404).json({ message: 'Compra no encontrada' });
    res.status(200).json(compra);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la compra', details: error.message });
  }
};

// Actualizar Compra
const updateCompra = async (req, res) => {
  try {
    const compraActualizada = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!compraActualizada) return res.status(404).json({ message: 'Compra no encontrada' });
    res.status(200).json(compraActualizada);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la compra', details: error.message });
  }
};

// Anular Compra
const anularCompra = async (req, res) => {
  try {
    const compraAnulada = await Compra.findById(req.params.id);
    if (!compraAnulada) return res.status(404).json({ message: 'Compra no encontrada' });
    
    // Obtener el producto usando el producto_servicio_id
    const producto = await ProductoServicio.findById(compraAnulada.producto_servicio_id);
    if (producto) {
      await ProductoServicio.findByIdAndUpdate(producto._id, { cantidad: producto.cantidad - compraAnulada.cantidad });
    } else {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizar el estado de la compra a anulada
    await Compra.findByIdAndUpdate(req.params.id, { estado: 'anulada' }, { new: true });
    
    res.status(200).json({ message: 'Compra anulada con éxito', compraAnulada });
  } catch (error) {
    res.status(500).json({ message: 'Error al anular la compra', details: error.message });
  }
};

module.exports = { getCompras, createCompra, getCompraById, updateCompra, anularCompra };


