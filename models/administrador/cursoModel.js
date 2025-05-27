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
    enum: ['carrera', 'taller'],
    required: true
  },
  precio: {
    type: Number,
    required: true,
    default: 0
  },
  carreras: [{
    type: Schema.Types.ObjectId,
    ref: 'carreras',
    required: function () {
      return this.tipo === 'carrera';
    }
  }],
  semestre: {
    type: Number,
    required: function () {
      return this.tipo === 'carrera';
    }
  }
}, {
  timestamps: true
});

const Curso = mongoose.model('cursos', cursoSchema, 'Cursos');

module.exports = Curso;
