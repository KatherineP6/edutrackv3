const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({

  bloque: {
    type: String,
    required: true
  },
  capacidad: {
    type: Number,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },

  disponible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true 
});

const Salon = mongoose.model('Salones', salonSchema, 'Salones');

module.exports = Salon;
