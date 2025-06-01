const mongoose = require('mongoose');
const Salon = require('../../models/administrador/salonModel');

const salonService = {
  getAllSalones: async () => {
    return await Salon.find().lean();
  },

  getSalonById: async (id) => {
    return await Salon.findById(id);
  },

  createSalon: async (data) => {
    const { capacidad, nombre, ubicacion,descripcion } = data;

    if (!capacidad || !nombre || !ubicacion) {
      throw new Error('Todos los campos son requeridos.');
    }

    const salonData = {
      capacidad: parseInt(capacidad),
      nombre,
      ubicacion,
      descripcion
    };

    const salon = new Salon(salonData);
    return await salon.save();
  },

  updateSalon: async (id, data) => {
    const { capacidad, nombre, ubicacion,descripcion } = data;

    if (!capacidad || !nombre || !ubicacion) {
      throw new Error('Todos los campos son requeridos.');
    }

    const updateData = {
      capacidad: parseInt(capacidad),
      nombre,
      ubicacion,
      descripcion
    };

    const salon = await Salon.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!salon) {
      throw new Error('Salón no encontrado.');
    }

    return salon;
  },

  deleteSalon: async (id) => {
    const salon = await Salon.findByIdAndDelete(id);

    if (!salon) {
      throw new Error('Salón no encontrado.');
    }

    return salon;
  },

 
};

module.exports = salonService;
