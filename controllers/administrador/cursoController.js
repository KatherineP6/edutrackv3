const Curso = require('../../models/administrador/cursoModel');
const cursoService = require('../../services/administrador/cursoService');

exports.getAllCursos = async (req, res) => {
  console.log('Sesión usuario:', req.session.userId, req.session.userRole);
  try {
    const cursos = await cursoService.getAllCursos();
    res.status(200).json(cursos);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCursoById = async (req, res) => {
  try {
    const curso = await cursoService.getCursoById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado.' });
    }
    res.json(curso);
  } catch (error) {
    console.error('Error obteniendo curso:', error);
    res.status(500).json({ message: 'Error interno al obtener curso.' });
  }
};

exports.createCurso = async (req, res) => {
  try {
    const { nombre, descripcion, tipo, precio, carreras } = req.body;
    // carreras debe ser un array de objetos { carrera, semestre }
    const savedCurso = await cursoService.createCurso({ nombre, descripcion, tipo, precio, carreras });
    res.status(201).json(savedCurso);
  } catch (error) {
    console.error('Error creating curso:', error);
    res.status(500).json({ message: 'Error al crear el curso' });
  }
};

exports.updateCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, tipo, precio, carreras } = req.body;
    const updatedCurso = await cursoService.updateCurso(id, { nombre, descripcion, tipo, precio, carreras });
    if (!updatedCurso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    res.json(updatedCurso);
  } catch (error) {
    console.error('Error updating curso:', error);
    res.status(500).json({ message: 'Error al actualizar el curso' });
  }
};

exports.deleteCurso = async (req, res) => {
  try {
    await cursoService.deleteCurso(req.params.id);
    res.json({ message: 'Curso eliminado exitosamente.' });
  } catch (error) {
    console.error('Error eliminando curso:', error);
    res.status(500).json({ message: 'Error interno al eliminar curso.' });
  }
};

exports.renderCursosPage = (req, res) => {
  res.render('administrador/menuadministrador', {
    activeSection: 'cursos',
    user: req.session.user || {},
    body: 'administrador/_ver-cursos'
  });
};

exports.getPrecioCursoByNombre = async (req, res) => {
  try {
    const nombreCurso = req.query.nombre;
    if (!nombreCurso) {
      return res.status(400).json({ message: 'El parámetro nombre es requerido.' });
    }
    const curso = await cursoService.getCursoByNombre(nombreCurso);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado.' });
    }
    res.json({ nombre: curso.nombre, precio: curso.precio });
  } catch (error) {
    console.error('Error al obtener precio del curso:', error);
    res.status(500).json({ message: 'Error interno al obtener precio del curso.' });
  }
};
