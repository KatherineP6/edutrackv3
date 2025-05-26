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
});

module.exports = mongoose.model('Salon', salonSchema);