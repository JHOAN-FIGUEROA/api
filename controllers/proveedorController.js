const Proveedor = require('../models/Proveedor');

// Obtener todos los proveedores
const getProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los proveedores' });
  }
};

// Crear un nuevo proveedor
const createProveedor = async (req, res) => {
  try {
    const nuevoProveedor = new Proveedor(req.body);
    await nuevoProveedor.save();
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el proveedor' });
  }
};

// Obtener un proveedor por ID
const getProveedorById = async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el proveedor' });
  }
};

// Actualizar un proveedor
const updateProveedor = async (req, res) => {
  try {
    const proveedorActualizado = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(proveedorActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el proveedor' });
  }
};

// Eliminar un proveedor
const deleteProveedor = async (req, res) => {
  try {
    await Proveedor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el proveedor' });
  }
};

module.exports = { getProveedores, createProveedor, getProveedorById, updateProveedor, deleteProveedor };
