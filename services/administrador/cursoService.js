const Curso = require('../../models/administrador/cursoModel');

const CursoService = {
  getAllCursos: async () => {
    return await Curso.find().lean();
  },

  getCursoById: async (id) => {
    return await Curso.findById(id);
  },

  createCurso: async (data) => {
    const { nombre, descripcion, tipo, precio, carreraId, semestre } = data;

    if (!nombre || !descripcion || !tipo || precio === undefined) {
      throw new Error('Campos requeridos faltantes.');
    }

    const CursoData = {
      nombre,
      descripcion,
      tipo,
      precio,
      carreraId: tipo === 'carrera' ? carreraId : null,
      semestre: tipo === 'carrera' ? semestre : null,
    };

    const curso = new Curso(CursoData);
    return await curso.save();
  },

  updateCurso: async (id, data) => {
    const { nombre, descripcion, tipo, precio, carreraId, semestre } = data;

    if (!nombre || !descripcion || !tipo || precio === undefined) {
      throw new Error('Campos requeridos faltantes.');
    }

    const updateData = {
      nombre,
      descripcion,
      tipo,
      precio,
      carreraId: tipo === 'carrera' ? carreraId : null,
      semestre: tipo === 'carrera' ? semestre : null
    };

    const Curso = await Curso.findByIdAndUpdate(id, updateData, { new: true });
    if (!Curso) {
      throw new Error('Curso no encontrado.');
    }
    return Curso;
  },

  deleteCurso: async (id) => {
    const Curso = await Curso.findByIdAndDelete(id);
    if (!Curso) {
      throw new Error('Curso no encontrado.');
    }
    return Curso;
  }
};

module.exports = CursoService;
