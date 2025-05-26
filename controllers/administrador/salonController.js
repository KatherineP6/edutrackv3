const Salon = require('../../models/administrador/salonModel');

// --- API Salones ---
exports.getAllSalones = async (req, res) => {
    try {
        const salones = await Salon.find().lean();
        res.json(salones);
    } catch (error) {
        console.error('Error obteniendo salones:', error);
        res.status(500).json({ message: 'Error interno al obtener salones.' });
    }
};

exports.getSalonById = async (req, res) => {
    try {
        const salon = await Salon.findById(req.params.id);
        if (!salon) {
            return res.status(404).json({ message: 'Salon no encontrado.' });
        }
        res.json(salon);
    } catch (error) {
        console.error('Error obteniendo salon:', error);
        res.status(500).json({ message: 'Error interno al obtener salon.' });
    }
};

exports.createSalon = async (req, res) => {
    try {
        const { nombre, capacidad } = req.body;

        if (!nombre || !capacidad) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const salon = new Salon({
            nombre,
            capacidad
        });

        await salon.save();
        res.status(201).json({ message: 'Salon creado exitosamente.', salon });
    } catch (error) {
        console.error('Error creando salon:', error);
        res.status(500).json({ message: 'Error interno al crear salon.' });
    }
};

exports.updateSalon = async (req, res) => {
    try {
        const { nombre, capacidad } = req.body;

        if (!nombre || !capacidad) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const salon = await Salon.findByIdAndUpdate(
            req.params.id,
            { nombre, capacidad },
            { new: true }
        );

        if (!salon) {
            return res.status(404).json({ message: 'Salon no encontrado.' });
        }

        res.json({ message: 'Salon actualizado exitosamente.', salon });
    } catch (error) {
        console.error('Error actualizando salon:', error);
        res.status(500).json({ message: 'Error interno al actualizar salon.' });
    }
};

exports.deleteSalon = async (req, res) => {
    try {
        const salon = await Salon.findByIdAndDelete(req.params.id);

        if (!salon) {
            return res.status(404).json({ message: 'Salon no encontrado.' });
        }

        res.json({ message: 'Salon eliminado exitosamente.' });
    } catch (error) {
        console.error('Error eliminando salon:', error);
        res.status(500).json({ message: 'Error interno al eliminar salon.' });
    }
};