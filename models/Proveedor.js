const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  compras: [
    {
      compra_id: { type: String, required: true },
      fecha: { type: Date, required: true },
      total: { type: Number, required: true },
      productos_servicios: [
        {
          producto_servicio_id: { type: String, required: true },
          nombre: { type: String, required: true },
          precio: { type: Number, required: true }
        }
      ]
    }
  ]
});

const Proveedor = mongoose.model('Proveedor', proveedorSchema);

module.exports = Proveedor;
