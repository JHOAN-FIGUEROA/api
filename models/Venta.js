const mongoose = require('mongoose'); 
const ventaSchema = new mongoose.Schema({
    _id: String,
    cliente_id: String,
    fecha: Date,
    total: Number,
    estado: { type: String, default: 'activa' },
    productos_servicios: [
      {
        producto_servicio_id: String,
        nombre: String,
        precio: Number
      }
    ]
  });
  
  const Venta = mongoose.model('Venta', ventaSchema);
  module.exports = Venta;
  