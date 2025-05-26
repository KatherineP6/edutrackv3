const express = require('express');
const router = express.Router();

const loginController = require('../../controllers/comun/loginController');

// Ruta para logout
router.post('/logout', loginController.logout);

module.exports = router;
