const Ticket = require('../../models/comun/ticketModel');
const crypto = require('crypto');

class TicketService {
  static async createTicket(userName, role) {
    // Generate a unique ticket number (e.g., using random bytes)
    const ticketNumber = crypto.randomBytes(4).toString('hex').toUpperCase();

    const ticketData = {
      ticketNumber,
      userName,
      role: role || 'sin rol',
      status: 'abierto'
    };

    const ticket = new Ticket(ticketData);
    await ticket.save();
    return ticket;
  }

  static async getTicketByNumber(ticketNumber) {
    return Ticket.findOne({ ticketNumber });
  }

  static async closeTicket(ticketNumber) {
    return Ticket.findOneAndUpdate({ ticketNumber }, { status: 'cerrado' }, { new: true });
  }

  static async getOpenTickets() {
    return Ticket.find({ status: { $ne: 'cerrado' } }).sort({ createdAt: -1 });
  }
}

module.exports = TicketService;
