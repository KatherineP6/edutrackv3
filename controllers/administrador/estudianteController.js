const Estudiante = require('../../models/administrador/estudianteModel');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// --- API Estudiantes ---
exports.getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.find().lean();
        res.json(estudiantes);
    } catch (error) {
        console.error('Error obteniendo estudiantes:', error);
        res.status(500).json({ message: 'Error interno al obtener estudiantes.' });
    }
};

exports.getEstudianteById = async (req, res) => {
    try {
        const estudiante = await Estudiante.findById(req.params.id);
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }
        res.json(estudiante);
    } catch (error) {
        console.error('Error obteniendo estudiante:', error);
        res.status(500).json({ message: 'Error interno al obtener estudiante.' });
    }
};

exports.createEstudiante = async (req, res) => {
    try {
        const { nombre, apellidos, email, password } = req.body;

        if (!nombre || !apellidos || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const estudiante = new Estudiante({
            nombre,
            apellidos,
            email,
            password: hashedPassword
        });

        await estudiante.save();
        res.status(201).json({ message: 'Estudiante creado exitosamente.', estudiante });
    } catch (error) {
        console.error('Error creando estudiante:', error);
        res.status(500).json({ message: 'Error interno al crear estudiante.' });
    }
};

exports.updateEstudiante = async (req, res) => {
    try {
        const { nombre, apellidos, email } = req.body;

        if (!nombre || !apellidos || !email) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const estudiante = await Estudiante.findByIdAndUpdate(
            req.params.id,
            { nombre, apellidos, email },
            { new: true }
        );

        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        res.json({ message: 'Estudiante actualizado exitosamente.', estudiante });
    } catch (error) {
        console.error('Error actualizando estudiante:', error);
        res.status(500).json({ message: 'Error interno al actualizar estudiante.' });
    }
};

exports.deleteEstudiante = async (req, res) => {
    try {
        const estudiante = await Estudiante.findByIdAndDelete(req.params.id);

        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        res.json({ message: 'Estudiante eliminado exitosamente.' });
    } catch (error) {
        console.error('Error eliminando estudiante:', error);
        res.status(500).json({ message: 'Error interno al eliminar estudiante.' });
    }
};
