const Producto = require('../models/Productos');

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const productos = await Productos.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
  try {
    const nuevoProducto = new Productos(req.body);
    await nuevoProductos.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto' });
  }
};

// Obtener un producto por ID
const getProductoById = async (req, res) => {
  try {
    const producto = await Productos.findById(req.params.id);
    if (!productos) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

// Actualizar un producto
const updateProducto = async (req, res) => {
  try {
    const productoActualizado = await Productos.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
const deleteProducto = async (req, res) => {
  try {
    await Productos.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};

module.exports = { getProductos, createProducto, getProductoById, updateProducto, deleteProducto };
