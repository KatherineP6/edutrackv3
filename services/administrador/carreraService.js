const Carrera = require('../../models/administrador/carreraModel');

const carreraService = {
  getAllCursos: async () => {
    return await Carrera.find().lean();
  },

  getCursoById: async (id) => {
    return await Carrera.findById(id);
  },

  createCurso: async (data) => {
    const { nombre, descripcion, duracionSem, precio } = data;

    if (!nombre || !descripcion || !duracionSem || precio === undefined) {
      throw new Error('Campos requeridos faltantes.');
    }

    const carreraData = {
      nombre,
      descripcion,
      duracionSem,
      precio,
  
    };

    const carrera = new Carrera(carreraData);
    return await carrera.save();
  },

  updateCurso: async (id, data) => {
    const { nombre, descripcion, duracionSem, precio} = data;

    if (!nombre || !descripcion || !duracionSem || precio === undefined) {
      throw new Error('Campos requeridos faltantes.');
    }

    const updateData = {
      nombre,
      descripcion,
      duracionSem,
      precio,
   
    };

    const carrera = await Carrera.findByIdAndUpdate(id, updateData, { new: true });
    if (!carrera) {
      throw new Error('Carrera no encontrado.');
    }
    return carrera;
  },

  deleteCurso: async (id) => {
    const carrera = await Carrera.findByIdAndDelete(id);
    if (!carrera) {
      throw new Error('Carrera no encontrado.');
    }
    return carrera;
  }
};

module.exports = carreraService;
