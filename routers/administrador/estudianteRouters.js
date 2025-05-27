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
    res.render('estudiante/menuestudiante', {
        user: {
            id: req.session.userId,
            role: req.session.userRole,
            email: req.session.email,
            name: req.session.userName || ''
        },
        activeSection: 'dashboard',
        body: 'dashboard'
    });
});

// Ruta para renderizar la vista de actividades del estudiante
router.get('/actividades', userLogin, (req, res) => {
    if (req.session.userRole !== 'Estudiante') {
        return res.status(403).send('Acceso denegado');
    }
    res.render('estudiante/menuestudiante', {
        user: {
            id: req.session.userId,
            role: req.session.userRole,
            email: req.session.email,
            name: req.session.userName || ''
        },
        activeSection: 'actividades',
        body: 'estudiante/actividades'
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

const mongoose = require('mongoose');

// Route to render student profile (miperfil) view
router.get('/miperfil', userLogin, async (req, res) => {
    if (req.session.userRole !== 'Estudiante') {
        return res.status(403).send('Acceso denegado');
    }
    try {
        const estudianteId = req.session.userId;
        if (!mongoose.Types.ObjectId.isValid(estudianteId)) {
            return res.status(400).send('ID de estudiante inválido');
        }
        const estudiante = await estudianteController.getEstudianteByIdData(estudianteId);
        if (!estudiante) {
            return res.status(404).send('Estudiante no encontrado');
        }
        res.render('estudiante/menuestudiante', {
            user: estudiante,
            activeSection: 'miperfil',
            body: 'miperfil'
        });
    } catch (error) {
        console.error('Error al obtener perfil del estudiante:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
