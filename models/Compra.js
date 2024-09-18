const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
    
    proveedor_id: { type: String, required: true },
    fecha: { type: Date, required: true },
    total: { type: Number, required: true },
    estado: {
        type: String,
        enum: ['pendiente', 'cancelado', 'completado'],
        default: 'pendiente'
    },
    productos_servicios: [
        {
           
            nombre: String,
            precio: Number,
            cantidad: Number,
        }
    ]
});

module.exports = mongoose.model('Compra', compraSchema);

