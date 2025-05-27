const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docenteSchema = new Schema({
  password: { 
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    trim: true
  },
  edad: {
    type: String,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  estado: {
    type: Boolean,
    default: true // Activo por defecto
  },
  gradoAcademico: {
    type: String,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  cursosAsignados: [{
    type: Schema.Types.ObjectId,
    ref: 'cursos'
  }]
}, {
  timestamps: true
});

const Docente = mongoose.model('Docente', docenteSchema, 'UsuarioDocente');
module.exports = Docente;
