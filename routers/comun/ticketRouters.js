const express = require('express');
const router = express.Router();
const ticketController = require('../../controllers/comun/ticketController');

// Ruta para crear un ticket
router.post('/', ticketController.createTicket);

// Ruta para cerrar un ticket por número
router.put('/close/:ticketNumber', ticketController.closeTicket);

module.exports = router;
