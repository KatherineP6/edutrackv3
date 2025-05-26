const express = require('express');
const router = express.Router();
const userLogin = require('../../middlewares/comun/userLogin');
const cursoController = require('../../controllers/administrador/cursoController');

//router.get('/', userLogin, (req, res) => res.redirect('/admin/cursos'));
router.get('/',  cursoController.getAllCursos);
router.get('/:id',  cursoController.getCursoById);
router.post('/',  cursoController.createCurso);
router.put('/:id',  cursoController.updateCurso);
router.delete('/:id',  cursoController.deleteCurso);

module.exports = router;
