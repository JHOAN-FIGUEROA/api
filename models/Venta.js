const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    fecha: { type: Date, required: true },
    total: { type: Number, required: true },
    estado: { type: String, default: 'completada' },
    productos_servicios: [
        {
            producto_servicio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductoServicio', required: true },
            nombre: { type: String, required: true },
            precio: { type: Number, required: true },
            cantidad: { type: Number, required: true },
        }
    ]
});

module.exports = mongoose.model('Venta', ventaSchema);

