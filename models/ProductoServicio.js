const mongoose = require('mongoose'); 
const productoServicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true }, // Asegúrate de que esto sea de tipo Number
  fechaIngreso: { type: Date, required: true },
  anulado: { type: Boolean, default: false },
  });
  
  const ProductoServicio = mongoose.model('ProductoServicio', productoServicioSchema);
  module.exports = ProductoServicio;
  
