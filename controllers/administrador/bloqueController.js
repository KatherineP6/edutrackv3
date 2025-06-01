const Bloque = require('../../models/administrador/bloqueModel'); // Ajusta la ruta si es necesario

// --- API Bloques ---

// Obtener todos los bloques con populate de curso, docente y salon
exports.getAllBloques = async (req, res) => {
  try {
    let bloques = await Bloque.find().lean();

    try {
      bloques = await Bloque.populate(bloques, { path: 'curso', select: '_id nombre' });
    } catch (err) {
      console.error('Error populating curso:', err);
    }

    try {
      bloques = await Bloque.populate(bloques, { path: 'docente', select: '_id nombre' });
    } catch (err) {
      console.error('Error populating docente:', err);
    }

    try {
      bloques = await Bloque.populate(bloques, { path: 'salon', select: '_id nombre' });
    } catch (err) {
      console.error('Error populating salon:', err);
    }

    if (!Array.isArray(bloques)) {
      console.error('Error: bloques no es un array:', bloques);
      return res.status(500).json({ error: 'Error interno: datos inválidos' });
    }

    res.status(200).json(bloques);
  } catch (error) {
    console.error('Error al obtener bloques:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener bloque por id con populate de curso, docente y salon
exports.getBloqueById = async (req, res) => {
  try {
    const bloque = await Bloque.findById(req.params.id)
      .populate('curso', '_id nombre')
      .populate('docente', '_id nombre')
      .populate('salon', '_id nombre')
      .lean();

    if (!bloque) {
      return res.status(404).json({ message: 'Bloque no encontrado.' });
    }

    res.json(bloque);
  } catch (error) {
    console.error('Error obteniendo bloque:', error);
    res.status(500).json({ message: 'Error interno al obtener bloque.' });
  }
};

// Crear nuevo bloque
exports.createBloque = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, diasSemana, horaInicio, horaFin, curso, docente, salon, estado } = req.body;

    if (!fechaInicio || !fechaFin || !diasSemana || !horaInicio || !horaFin || !curso || !docente || !salon) {
      return res.status(400).json({ message: 'Faltan datos requeridos para crear el bloque.' });
    }

    const nuevoBloque = new Bloque({
      fechaInicio,
      fechaFin,
      diasSemana,
      horaInicio,
      horaFin,
      curso,
      docente,
      salon,
      estado: typeof estado === 'number' ? estado : 1
    });

    const savedBloque = await nuevoBloque.save();

    res.status(201).json({ message: 'Bloque creado exitosamente.', bloque: savedBloque });
  } catch (error) {
    console.error('Error creando bloque:', error);
    res.status(500).json({ message: 'Error interno al crear bloque.' });
  }
};

// Actualizar bloque
exports.updateBloque = async (req, res) => {
  try {
    const { id } = req.params;
    const { fechaInicio, fechaFin, diasSemana, horaInicio, horaFin, curso, docente, salon, estado } = req.body;

    if (!fechaInicio || !fechaFin || !diasSemana || !horaInicio || !horaFin || !curso || !docente || !salon) {
      return res.status(400).json({ message: 'Faltan datos requeridos para actualizar el bloque.' });
    }

    const updateData = {
      fechaInicio,
      fechaFin,
      diasSemana,
      horaInicio,
      horaFin,
      curso,
      docente,
      salon,
      estado: typeof estado === 'number' ? estado : 1
    };

    const bloqueActualizado = await Bloque.findByIdAndUpdate(id, updateData, { new: true });

    if (!bloqueActualizado) {
      return res.status(404).json({ message: 'Bloque no encontrado.' });
    }

    res.json({ message: 'Bloque actualizado exitosamente.', bloque: bloqueActualizado });
  } catch (error) {
    console.error('Error actualizando bloque:', error);
    res.status(500).json({ message: 'Error interno al actualizar bloque.' });
  }
};

// Eliminar bloque
exports.deleteBloque = async (req, res) => {
  try {
    const bloqueEliminado = await Bloque.findByIdAndDelete(req.params.id);

    if (!bloqueEliminado) {
      return res.status(404).json({ message: 'Bloque no encontrado.' });
    }

    res.json({ message: 'Bloque eliminado exitosamente.' });
  } catch (error) {
    console.error('Error eliminando bloque:', error);
    res.status(500).json({ message: 'Error interno al eliminar bloque.' });
  }
};
