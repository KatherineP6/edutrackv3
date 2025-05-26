const mongoose = require('mongoose');

const docenteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'docente' },
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Docente', docenteSchema);