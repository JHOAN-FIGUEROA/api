const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductoServicioSchema = new Schema({
  producto_servicio_id: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
});

const CompraSchema = new Schema({
  proveedor_id: {
    type: String,
    
  },
  fecha: {
    type: Date,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  
});

const Compra = mongoose.model('Compra', CompraSchema);

module.exports = Compra;
