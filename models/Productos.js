const mongoose = require('mongoose'); 
const productoServicioSchema = new mongoose.Schema({
 _id: {
    type: String, // Usar String si prefieres manejar _id como un identificador personalizado
    required: true
  },
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
  
  const ProductoServicio = mongoose.model('ProductoServicio', productoServicioSchema);
  module.exports = ProductoServicio;
  
