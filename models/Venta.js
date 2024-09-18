const mongoose = require('mongoose'); 
const ventaSchema = new mongoose.Schema({
     
  cliente: { type: String, required: true },
  fecha: { type: Date, required: true },
  total: { type: Number, required: true },
   estado: { type: String, default: 'activa' },
},
  productos_servicios: [
    {
      producto_servicio_id: String,
      nombre: String,
      precio: Number,
      cantidad : Number,
    }
  ]
});

module.exports = mongoose.model('Venta', ventaSchema);
  const Venta = mongoose.model('Venta', ventaSchema);
  module.exports = Venta;
  
