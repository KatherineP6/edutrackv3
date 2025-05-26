const express = require('express');
const router = express.Router();
const userLogin = require('../../middlewares/comun/userLogin');
const carreraController = require('../../controllers/administrador/carreraController');

router.get('/', userLogin, (req, res) => res.redirect('/admin/carreras'));

// Rutas para carreras
router.get('/', userLogin,  carreraController.getAllCarreras);
router.post('/', userLogin,  carreraController.createCarrera);
router.put('/:id', userLogin,  carreraController.updateCarrera);
router.delete('/:id', userLogin,  carreraController.deleteCarrera);

module.exports = router;
