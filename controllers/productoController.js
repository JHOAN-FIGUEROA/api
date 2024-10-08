const ProductoServicio = require('../models/ProductoServicio');

exports.getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
};

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const productos = await ProductoServicio.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, tipo } = req.body;

    // Validación simple para asegurar que los campos requeridos están presentes
    if (!nombre || !descripcion || !precio || !tipo) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const nuevoProducto = new ProductoServicio({ nombre, descripcion, precio, tipo });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto', error });
  }
};



// Actualizar un producto
const updateProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, tipo } = req.body;

    const productoActualizado = await ProductoServicio.findByIdAndUpdate(
      req.params.id, 
      { nombre, descripcion, precio, tipo }, 
      { new: true }
    );

    if (!productoActualizado) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto', error });
  }
};

// Eliminar un producto
const deleteProducto = async (req, res) => {
  try {
    const productoEliminado = await ProductoServicio.findByIdAndDelete(req.params.id);
    if (!productoEliminado) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};

module.exports = { getProductos, createProducto, getProductoById, updateProducto, deleteProducto };
