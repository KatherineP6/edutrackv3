const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carreraSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: false,
    trim: true
  },
  duracionSem: {
    type: Number,
    required: true
  },
  precio: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const Carrera = mongoose.model('carreras', carreraSchema, 'Carreras');

module.exports = Carrera;
