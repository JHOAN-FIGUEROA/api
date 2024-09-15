const Producto = require('../models/Productos');

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find();  // Cambiado de Productos a Producto
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);  // Cambiado de Productos a Producto
    await nuevoProducto.save();  // Cambiado de nuevoProductos.save() a nuevoProducto.save()
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto' });
  }
};

// Obtener un producto por ID
const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);  // Cambiado de Productos a Producto
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });  // Cambiado de productos a producto
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

// Actualizar un producto
const updateProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });  // Cambiado de Productos a Producto
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
const deleteProducto = async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);  // Cambiado de Productos a Producto
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};

module.exports = { getProductos, createProducto, getProductoById, updateProducto, deleteProducto };
