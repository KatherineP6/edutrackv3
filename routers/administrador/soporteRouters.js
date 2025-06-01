const express = require('express');
const router = express.Router();
const userLogin = require('../../middlewares/comun/userLogin');
const soporteController = require('../../controllers/administrador/soporteController');

// Rutas para soporte
router.get('/', userLogin, soporteController.getAllSoportes);
router.get('/:id', userLogin, soporteController.getSoporteById);
router.post('/', userLogin, soporteController.createSoporte);
router.put('/:id', userLogin, soporteController.updateSoporte);
router.delete('/:id', userLogin, soporteController.deleteSoporte);

module.exports = router;
