const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  userName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'sin rol'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['abierto', 'cerrado'],
    default: 'abierto'
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema, 'Tickets');

module.exports = Ticket;
