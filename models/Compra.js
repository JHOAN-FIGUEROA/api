const mongoose = require('mongoose'); 
const compraSchema = new mongoose.Schema({
    _id: String,
    proveedor_id: String,
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
  
  const Compra = mongoose.model('Compra', compraSchema);
  module.exports = Compra;
  