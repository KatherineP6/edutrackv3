const Carrera = require('../../models/administrador/carreraModel');

const carreraService = {
  getAllCarrera: async () => {
    return await Carrera.find().lean();
  },

  getCarreraById: async (id) => {
    return await Carrera.findById(id);
  },

  createCarrera: async (data) => {
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

  updateCarrera: async (id, data) => {
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

  deleteCarrera: async (id) => {
    const carrera = await Carrera.findByIdAndDelete(id);
    if (!carrera) {
      throw new Error('Carrera no encontrado.');
    }
    return carrera;
  }
};

module.exports = carreraService;
