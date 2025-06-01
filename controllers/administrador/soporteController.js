const bcrypt = require('bcrypt');
const Soporte = require('../../models/administrador/soporte');

// Obtener todos los soportes
exports.getAllSoportes = async (req, res) => {
  try {
    const soportes = await Soporte.find().lean();
    res.status(200).json(soportes);
  } catch (error) {
    console.error('Error al obtener soportes:', error);
    res.status(500).json({ message: 'Error interno al obtener soportes.' });
  }
};

// Obtener soporte por ID
exports.getSoporteById = async (req, res) => {
  try {
    const soporte = await Soporte.findById(req.params.id).lean();
    if (!soporte) {
      return res.status(404).json({ message: 'Soporte no encontrado.' });
    }
    res.status(200).json(soporte);
  } catch (error) {
    console.error('Error al obtener soporte por ID:', error);
    res.status(500).json({ message: 'Error interno al obtener soporte.' });
  }
};

// Crear nuevo soporte
exports.createSoporte = async (req, res) => {
  try {
    const { nombre, apellido, correo, password, telefono, direccion, estado } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    const existingUser = await Soporte.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoSoporte = new Soporte({
      nombre,
      apellido,
      correo,
      password: hashedPassword,
      telefono,
      direccion,
      estado: typeof estado === 'number' ? estado : 1
    });

    const savedSoporte = await nuevoSoporte.save();
    res.status(201).json({ message: 'Soporte creado exitosamente.', soporte: savedSoporte });
  } catch (error) {
    console.error('Error creando soporte:', error);
    res.status(500).json({ message: 'Error interno al crear soporte.' });
  }
};

// Actualizar soporte
exports.updateSoporte = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, password, telefono, direccion, estado } = req.body;

    const updateData = {
      nombre,
      apellido,
      correo,
      telefono,
      direccion,
      estado: typeof estado === 'number' ? estado : 1
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const soporteActualizado = await Soporte.findByIdAndUpdate(id, updateData, { new: true });

    if (!soporteActualizado) {
      return res.status(404).json({ message: 'Soporte no encontrado.' });
    }

    res.json({ message: 'Soporte actualizado exitosamente.', soporte: soporteActualizado });
  } catch (error) {
    console.error('Error actualizando soporte:', error);
    res.status(500).json({ message: 'Error interno al actualizar soporte.' });
  }
};

// Eliminar soporte
exports.deleteSoporte = async (req, res) => {
  try {
    const soporteEliminado = await Soporte.findByIdAndDelete(req.params.id);

    if (!soporteEliminado) {
      return res.status(404).json({ message: 'Soporte no encontrado.' });
    }

    res.json({ message: 'Soporte eliminado exitosamente.' });
  } catch (error) {
    console.error('Error eliminando soporte:', error);
    res.status(500).json({ message: 'Error interno al eliminar soporte.' });
  }
};
