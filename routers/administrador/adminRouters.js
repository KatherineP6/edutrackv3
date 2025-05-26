const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/administrador/adminController');
const salonController = require('../../controllers/administrador/salonController');
const estudiantesController = require('../../controllers/administrador/estudiantesController');
const carreraController = require('../../controllers/administrador/carreraController');
const userLogin = require('../../middlewares/comun/userLogin'); 

console.log('Tipo de userLogin:', typeof userLogin);
console.log('Tipo de estudiantesController.getAllEstudiantes:', typeof estudiantesController.getAllEstudiantes);

// Servir archivos estáticos
router.use('/assets', express.static('public/assets'));

// Rutas para las vistas
router.get('/', (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', adminController.renderAdminDashboard);
router.get('/salones', userLogin, adminController.renderAdminDashboard);
router.get('/estudiantes', userLogin, adminController.renderAdminDashboard);
router.get('/docentes', userLogin, adminController.renderAdminDashboard);
router.get('/reportes', userLogin, adminController.renderAdminDashboard);
router.get('/cursos', userLogin, adminController.renderAdminDashboard);
router.get('/carreras', userLogin, adminController.renderAdminDashboard);

// Rutas para salones
router.get('/api/salones', userLogin, salonController.getAllSalones);
router.post('/api/salones', userLogin, salonController.createSalon);
//router.get('/api/salones/:id', userLogin, salonController.getSalonById);
router.put('/api/salones/:id', userLogin, salonController.updateSalon);
router.delete('/api/salones/:id', userLogin, salonController.deleteSalon);
//router.get('/api/salones/rendimiento', userLogin, salonController.getSalonesRendimiento);

// Rutas para la asignación de docentes y estudiantes a salones
//router.post('/api/salones/:id/docente', userLogin, salonController.assignOrUnassignDocente);
//router.post('/api/salones/:id/estudiantes', userLogin, salonController.assignEstudianteToSalon);
//yyyrouter.delete('/api/salones/:id/estudiantes/:estudianteId', userLogin, salonController.unassignEstudianteFromSalon);

// Rutas para estudiantes
router.get('/api/estudiantes', userLogin, estudiantesController.getAllEstudiantes);
//router.get('/api/estudiantes/disponibles', userLogin, salonController.getAvailableEstudiantes);
router.post('/api/estudiantes', userLogin, estudiantesController.createEstudiante);
router.get('/api/estudiantes/:id', userLogin, estudiantesController.getEstudianteById);
router.put('/api/estudiantes/:id', userLogin, estudiantesController.updateEstudiante);

// Rutas para carreras
router.get('/', userLogin, carreraController.getAllCarrera);
router.post('/', userLogin, carreraController.createCarrera);
router.put('/:id', userLogin, carreraController.updateCarrera);
router.delete('/:id', userLogin, carreraController.deleteCarrera);

module.exports = router;
