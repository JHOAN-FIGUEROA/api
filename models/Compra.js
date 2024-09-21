const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
    proveedor: { type: String, required: true },
    fecha: { type: Date, required: true },
    total: { type: Number, required: true },
    estado: {
        type: String,
        enum: ['completado'],
        default: 'completado'
    },
    productos_servicios: [
        {
            producto_servicio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductoServicio', required: true },
            nombre: { type: String, required: true },
            precio: { type: Number, required: true },
            cantidad: { type: Number, required: true },
        }
    ]
});

module.exports = mongoose.model('Compra', compraSchema);
