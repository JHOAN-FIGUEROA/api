const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  correo: String,
  telefono: String,
  
    }],
  }],
});

const Cliente = mongoose.model('Cliente', clienteSchema);
module.exports = Cliente;
