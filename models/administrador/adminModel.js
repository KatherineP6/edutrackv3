const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  nombre: String,
  apellido: String,
  correo: {
    type: String,
    required: true,
    unique: true, 
    trim: true,    
  },
  password: {
    type: String,
    required: true
  },
  telefono: String,
  direccion: String,
  estado: {
    type: Number,
    default: 1 
  }
}, {
  timestamps: true 
});
const Admin = mongoose.model('administradores', adminSchema, 'UsuarioAdministrador');
module.exports = Admin;
