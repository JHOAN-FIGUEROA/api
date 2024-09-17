const mongoose = require('mongoose');
const { Schema } = mongoose;



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
