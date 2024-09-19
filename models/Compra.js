const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
    
    proveedor: { type: String, required: true },
    fecha: { type: Date, required: true },
    total: { type: Number, required: true },
    
    productos_servicios: [
        {
           
            nombre: String,
            precio: Number,
            cantidad: Number,
        }
    ]
});

module.exports = mongoose.model('Compra', compraSchema);

