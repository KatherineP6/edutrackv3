const express = require('express');
const router = express.Router();
const userLogin = require('../../middlewares/comun/userLogin');
const estudianteController = require('../../controllers/administrador/estudianteController');

// Ruta para renderizar la vista de estudiantes
router.get('/view', userLogin, (req, res) => {
    res.render('administrador/ver-estudiantes', {
        user: {
            id: req.session.userId,
            role: req.session.userRole,
            email: req.session.email,
            name: req.session.userName || ''
        }
    });
});

// Ruta para obtener todos los estudiantes en JSON
router.get('/', estudianteController.getAllEstudiantes);
router.post('/',  estudianteController.createEstudiante);
router.put('/:id',  estudianteController.updateEstudiante);
router.delete('/:id',  estudianteController.deleteEstudiante);

// Route to render student dashboard
router.get('/dashboard', userLogin, (req, res) => {
    if (req.session.userRole !== 'Estudiante') {
        return res.status(403).send('Acceso denegado');
    }
    res.render('estudiante/dashboard', {
        user: {
            id: req.session.userId,
            role: req.session.userRole,
            email: req.session.email,
            name: req.session.userName || ''
        }
    });
});

// Stub route for cursos
router.get('/cursos', userLogin, async (req, res) => {
  try {
    // TODO: Replace with real DB query filtered by logged-in estudiante
    const sampleCursos = [
      { _id: '1', Nombre: 'Matemáticas', bloque: 'A', ubicacion: 'Aula 101', docente: { Nombre: 'Juan', Apellido: 'Perez' } },
      { _id: '2', Nombre: 'Historia', bloque: 'B', ubicacion: 'Aula 102', docente: { Nombre: 'Maria', Apellido: 'Lopez' } }
    ];
    res.json(sampleCursos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo cursos' });
  }
});

// Stub route for asistencia
router.get('/asistencia', userLogin, async (req, res) => {
  try {
    // TODO: Replace with real data
    const sampleAsistencia = [
      { _id: '1', fecha: new Date(), cursoNombre: 'Matemáticas', estado: 'Presente' },
      { _id: '2', fecha: new Date(), cursoNombre: 'Historia', estado: 'Ausente' }
    ];
    res.json(sampleAsistencia);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo asistencia' });
  }
});

module.exports = router;
