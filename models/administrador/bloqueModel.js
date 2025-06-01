const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bloqueSchema = new Schema({
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  diasSemana: {
    type: [String],
    enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    required: true
  },
  horaInicio: {
    type: String,
    required: true
  },
  horaFin: {
    type: String,
    required: true
  },
  curso: {
    type: Schema.Types.ObjectId,
    ref: 'cursos',
    required: true
  },
  docente: {
    type: Schema.Types.ObjectId,
    ref: 'docentes',
    required: true
  },
  salon: {
    type: Schema.Types.ObjectId,
    ref: 'salones',
    required: true
  },
}, {
  timestamps: true
});


const Bloque = mongoose.model('bloques', bloqueSchema, 'Bloques');

module.exports = Bloque;
