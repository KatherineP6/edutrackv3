const Curso = require('../../models/administrador/cursoModel');

const CursoService = {
  getAllCursos: async () => {
    return await Curso.find().lean();
  },

  getCursoById: async (id) => {
    return await Curso.findById(id);
  },

  createCurso: async (data) => {
    let { nombre, descripcion, tipo, precio, carrera, semestre } = data;

    descripcion = descripcion ? descripcion.trim() : descripcion;

    if (!nombre || !tipo || precio === undefined) {
      throw new Error('Campos requeridos faltantes.');
    }

    /*if (tipo === 'carrera' && (!carrera || carrera.trim() === '')) {
      throw new Error('Debe seleccionar una carrera para cursos tipo carrera.');
    }

    if (tipo === 'taller') {
      carreraId = null;
    }

    if (tipo !== 'taller' && (!descripcion || descripcion.trim() === '')) {
      throw new Error('La descripción es obligatoria para cursos tipo carrera.');
    }*/

    const CursoData = {
      nombre,
      descripcion,
      tipo,
      precio,
      carrera,
      semestre,
    };

    const curso = new Curso(CursoData);
    return await curso.save();
  },

  updateCurso: async (id, data) => {
    let { nombre, descripcion, tipo, precio, carrera, semestre } = data;

    descripcion = descripcion ? descripcion.trim() : descripcion;

    if (!nombre || !tipo || precio === undefined) {
      throw new Error('Campos requeridos faltantes.');
    }

  /*  if (tipo === 'carrera' && (!carreraId || carreraId.trim() === '')) {
      throw new Error('Debe seleccionar una carrera para cursos tipo carrera.');
    }

    if (tipo === 'taller') {
      carreraId = null;
    }

    if (tipo !== 'taller' && (!descripcion || descripcion.trim() === '')) {
      throw new Error('La descripción es obligatoria para cursos tipo carrera.');
    }*/

    const updateData = {
      nombre,
      descripcion,
      tipo,
      precio,
      carrera,
      semestre,
    };

    const curso = await Curso.findByIdAndUpdate(id, updateData, { new: true });
    if (!curso) {
      throw new Error('Curso no encontrado.');
    }
    return curso;
  },

  deleteCurso: async (id) => {
    const curso = await Curso.findByIdAndDelete(id);
    if (!curso) {
      throw new Error('Curso no encontrado.');
    }
    return curso;
  }
};

module.exports = CursoService;
