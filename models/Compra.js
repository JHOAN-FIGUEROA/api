const mongoose = require('mongoose');
const { Schema } = mongoose;
const CompraSchema = new Schema({
 compra_id: {
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
  },cantidad: {
    type: Number,
    required: true
  },

  proveedor: {
    type: String,
    required: true,
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
