const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mensajeSchema = new Schema({
  rol: String,
  ticket: String,
  message: String,
}, { timestamps: true }); 


const Mensaje = mongoose.model('Mensaje', mensajeSchema, 'Mensaje');

module.exports = Mensaje;
