const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  correo: String,
  telefono: String,
  ventas: [{
    venta_id: String,
    fecha: Date,
    total: Number,
    productos_servicios: [{
      producto_servicio_id: String,
      nombre: String,
      precio: Number,
    }],
  }],
});

const Cliente = mongoose.model('Cliente', clienteSchema);
module.exports = Cliente;
