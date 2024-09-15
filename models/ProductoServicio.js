const mongoose = require('mongoose'); 
const productoServicioSchema = new mongoose.Schema({
    _id: String,
    nombre: String,
    descripcion: String,
    precio: Number,
    tipo: String
  });
  
  const ProductoServicio = mongoose.model('ProductoServicio', productoServicioSchema);
  module.exports = ProductoServicio;
  