const express = require('express');
const router = express.Router();
const userLogin = require('../../middlewares/comun/userLogin');
const carreraController = require('../../controllers/administrador/carreraController');

//router.get('/', userLogin, (req, res) => res.redirect('/admin/carreras'));

// Rutas para carreras
router.get('/',  carreraController.getAllCarrera);
router.get('/public', carreraController.getAllCarreraPublic);
router.post('/',  carreraController.createCarrera);
router.put('/:id',  carreraController.updateCarrera);
router.delete('/:id',  carreraController.deleteCarrera);

module.exports = router;
