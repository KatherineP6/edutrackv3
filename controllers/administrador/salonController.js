const salonService = require('../../services/administrador/salonService');

// --- API Salones ---
exports.getAllSalones = async (req, res) => {
    try {
        const salones = await salonService.getAllSalones();
        res.json(salones);
    } catch (error) {
        console.error('Error obteniendo salones:', error);
        res.status(500).json({ message: 'Error interno al obtener salones.' });
    }
};

exports.getSalonById = async (req, res) => {
    try {
        const salon = await salonService.getSalonById(req.params.id);
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
        const { bloque, capacidad, ubicacion } = req.body;

        if (!bloque || !capacidad || !ubicacion) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const salon = await salonService.createSalon({ bloque, capacidad, ubicacion });
        res.status(201).json({ message: 'Salon creado exitosamente.', salon });
    } catch (error) {
        console.error('Error creando salon:', error);
        res.status(500).json({ message: error.message || 'Error interno al crear salon.' });
    }
};

exports.updateSalon = async (req, res) => {
    try {
        const { bloque, capacidad, ubicacion } = req.body;

        if (!bloque || !capacidad || !ubicacion) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const salon = await salonService.updateSalon(req.params.id, { bloque, capacidad, ubicacion });
        res.json({ message: 'Salon actualizado exitosamente.', salon });
    } catch (error) {
        console.error('Error actualizando salon:', error);
        res.status(500).json({ message: error.message || 'Error interno al actualizar salon.' });
    }
};

exports.deleteSalon = async (req, res) => {
    try {
        await salonService.deleteSalon(req.params.id);
        res.json({ message: 'Salon eliminado exitosamente.' });
    } catch (error) {
        console.error('Error eliminando salon:', error);
        res.status(500).json({ message: error.message || 'Error interno al eliminar salon.' });
    }
};
