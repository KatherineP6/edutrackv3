const Docente = require('../../models/administrador/docenteModel');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const docenteService = {
  getAllDocentes: async () => {
    return await Docente.find().lean();
  },

  getDocenteById: async (id) => {
    return await Docente.findById(id);
  },

  createDocente: async (data) => {
    const { nombre, apellido, email, password } = data;

    if (!nombre || !apellido || !email || !password) {
      throw new Error('Todos los campos son requeridos.');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const docente = new Docente({
      nombre,
      apellido,
      email,
      password: hashedPassword
    });

    return await docente.save();
  },

  updateDocente: async (id, data) => {
    const { nombre, apellido, email, password } = data;

    if (!nombre || !apellido || !email) {
      throw new Error('Todos los campos son requeridos.');
    }

    const updateData = {
      nombre,
      apellido,
      email
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const docente = await Docente.findByIdAndUpdate(id, updateData, { new: true });
    if (!docente) {
      throw new Error('Docente no encontrado.');
    }
    return docente;
  },

  deleteDocente: async (id) => {
    const docente = await Docente.findByIdAndDelete(id);
    if (!docente) {
      throw new Error('Docente no encontrado.');
    }
    return docente;
  }
};

module.exports = docenteService;
