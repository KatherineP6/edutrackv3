const bcrypt = require('bcrypt');
const Soporte = require('../../models/administrador/soporte');

class SoporteService {
  static async getAll() {
    return await Soporte.find().lean();
  }

  static async getById(id) {
    return await Soporte.findById(id).lean();
  }

  static async create(data) {
    const { correo, password } = data;
    if (!correo || !password) {
      throw new Error('Correo y contraseña son obligatorios.');
    }

    const existingUser = await Soporte.findOne({ correo });
    if (existingUser) {
      throw new Error('El correo ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSoporte = new Soporte({
      ...data,
      password: hashedPassword
    });

    return await newSoporte.save();
  }

  static async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await Soporte.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id) {
    return await Soporte.findByIdAndDelete(id);
  }
}

module.exports = SoporteService;
