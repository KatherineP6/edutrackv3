const TicketService = require('../../services/comun/ticketService');

exports.createTicket = async (req, res) => {
  try {
    const { userName, role } = req.body;

    if (!userName) {
      return res.status(400).json({ message: 'El nombre de usuario es obligatorio.' });
    }

    const ticket = await TicketService.createTicket(userName, role);
    res.status(201).json({ message: 'Ticket creado exitosamente.', ticket });
  } catch (error) {
    console.error('Error creando ticket:', error);
    res.status(500).json({ message: 'Error interno al crear ticket.' });
  }
};

exports.closeTicket = async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const ticket = await TicketService.closeTicket(ticketNumber);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket no encontrado.' });
    }

    res.json({ message: 'Ticket cerrado exitosamente.', ticket });
  } catch (error) {
    console.error('Error cerrando ticket:', error);
    res.status(500).json({ message: 'Error interno al cerrar ticket.' });
  }
};
