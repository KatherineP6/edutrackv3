const express = require('express');
const router = express.Router();
const userLogin = require('../../middlewares/comun/userLogin');
const bloqueController = require('../../controllers/administrador/bloqueController');

//router.get('/', userLogin, (req, res) => res.redirect('/admin/carreras'));

// Rutas para bloques
router.get('/', userLogin, bloqueController.getAllBloques);
router.get('/:id', userLogin, bloqueController.getBloqueById);
router.post('/', userLogin, bloqueController.createBloque);
router.post('/:id', userLogin, bloqueController.updateBloque);
router.put('/:id', userLogin, bloqueController.updateBloque);
router.delete('/:id', userLogin, bloqueController.deleteBloque);

module.exports = router;
