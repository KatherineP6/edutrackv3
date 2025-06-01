const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cursoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true,
    default: 0
  },
  carreras: [{
    carrera: {
      type: Schema.Types.ObjectId,
      ref: 'carreras',
      required: true
    },
    semestre: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});

const Curso = mongoose.model('cursos', cursoSchema, 'Cursos');

module.exports = Curso;
