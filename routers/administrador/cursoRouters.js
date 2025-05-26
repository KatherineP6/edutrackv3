const express = require('express');
const router = express.Router();
const userLogin = require('../../middlewares/comun/userLogin');
const cursoController = require('../../controllers/administrador/cursoController');

router.get('/', userLogin, (req, res) => res.redirect('/admin/cursos'));
router.get('/', userLogin, cursoController.getAllCursos);
router.get('/:id', userLogin, cursoController.getCursoById);
router.post('/', userLogin, cursoController.createCurso);
router.put('/:id', userLogin, cursoController.updateCurso);
router.delete('/:id', userLogin, cursoController.deleteCurso);

module.exports = router;
