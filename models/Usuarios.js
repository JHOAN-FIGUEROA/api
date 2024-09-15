const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
  confirmarContraseña: {
    type: String,
    required: true,
  },
});

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
  if (this.isModified('contraseña') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      this.contraseña = await bcrypt.hash(this.contraseña, salt);
      this.confirmarContraseña = undefined; // No guardes la contraseña confirmada
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.contraseña);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

