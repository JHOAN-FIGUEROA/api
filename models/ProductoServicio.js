const mongoose = require('mongoose'); 
const ProductoServicioSchema = new mongoose.Schema({
 
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  tipo: {
    type: String,
    enum: ['Producto', 'Servicio'], // Enum para limitar los valores posibles
    required: true
  }
});
  
const ProductoServicio = mongoose.model('ProductoServicio', ProductoServicioSchema);

  module.exports = ProductoServicio;
  
