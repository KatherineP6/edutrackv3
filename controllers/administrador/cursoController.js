const cursoService = require('../../services/administrador/cursoService');

exports.getAllCursos = async (req, res) => {
  try {
    const cursos = await cursoService.getAllCursos();
    res.status(200).json(cursos);
  } catch (error) {
    console.error('Error obteniendo cursos:', error);
    res.status(500).json({ message: 'Error interno al obtener cursos.' });
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
    const curso = await cursoService.createCurso(req.body);
    res.status(201).json({ message: 'Curso creado exitosamente.', curso });
  } catch (error) {
    console.error('Error creando curso:', error);
    res.status(500).json({ message: 'Error interno al crear curso.' });
  }
};

exports.updateCurso = async (req, res) => {
  try {
    const curso = await cursoService.updateCurso(req.params.id, req.body);
    res.json({ message: 'Curso actualizado exitosamente.', curso });
  } catch (error) {
    console.error('Error actualizando curso:', error);
    res.status(500).json({ message: 'Error interno al actualizar curso.' });
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
