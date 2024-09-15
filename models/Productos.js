const mongoose = require('mongoose'); 
const productosSchema = new mongoose.Schema({
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
  
  const Productos= mongoose.model('Productos', productosSchema);
  module.exports = Productos;
  
