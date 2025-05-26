const Curso = require('../../models/administrador/cursoModel');
const cursoService = require('../../services/administrador/cursoService');

exports.getAllCursos = async (req, res) => {
  console.log('Sesión usuario:', req.session.userId, req.session.userRole);
  try {
    const curso = await cursoService.getAllCursos();
    //console.log(docentes); // **No necesitamos esto para la respuesta**
    res.status(200).json(curso); // **Enviamos la respuesta como JSON**
  } catch (error) {
    console.error('Error al obtener docentes:', error);
    res.status(500).json({ "error": error.message }); // **Enviamos el error como JSON**
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
      const { nombre, descripcion, tipo, precio,carreraId,semestre } = req.body;
      const nuevaCurso = new Curso({ nombre, descripcion, tipo, precio,carreraId,semestre });
      const savedCurso = await nuevaCurso.save();
      res.status(201).json(savedCurso);
    } catch (error) {
      console.error('Error creating curso:', error);
      res.status(500).json({ message: 'Error al crear la curso' });
    }

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
