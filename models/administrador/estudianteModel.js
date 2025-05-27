const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const estudianteSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  edad: String,
  apellidos: {
    type: String,
    required: true
  },
  direccion: String,
  telefono: String,
  estado: {
    type: Boolean,
    default: true // Activo por defecto
  },
  salon: String,
  documentos: String,
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  carreraId: {
    type: Schema.Types.ObjectId,
    ref: 'Carrera',
    required: false,
  },
  semestreActual: {
    type: Number,
    required: false
  },
  cursosInscritos: [{
    type: String,
    required: false
  }],
}, {
  timestamps: true 
});

const Estudiante = mongoose.model('Estudiante', estudianteSchema, 'UsuarioEstudiante');
module.exports = Estudiante;
