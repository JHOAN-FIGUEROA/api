const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
    
    proveedor: { type: String,},
    fecha: { type: Date, required: true },
    total: { type: Number, required: true },
    estado: {
        type: String,
        enum: ['pendiente', 'cancelado', 'completado'],
        default: 'completado'
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
