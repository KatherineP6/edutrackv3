


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docenteSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  Nombre: {
    type: String,
    required: true
  },
  Edad: String,
  Apellidos: {
    type: String,
    required: true
  },
  Direccion: String,
  Telefono: String,
  Estado: String,
  Salon: String,
  documentos: String,
  GradoAcademico: String,
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  cursos: [{
    type: String,
    required: false
  }],
  
}, {
  timestamps: true 
});

const Docente = mongoose.model('Docente', docenteSchema, 'UsuarioDocente');

module.exports = Docente;
