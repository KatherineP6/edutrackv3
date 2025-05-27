const Estudiante = require('../../models/administrador/estudianteModel');
const Carrera = require('../../models/administrador/carreraModel');
const estudiantesService = require('../../services/administrador/estudianteService');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// --- API Estudiantes ---
exports.getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.find().lean();
        const carreras = await Carrera.find().lean();
        const estudiantesConCarrera = estudiantes.map(est => {
            const carrera = carreras.find(c => c._id.toString() === est.carreraId);
            return {
                ...est,
                nombreCarrera: carrera ? carrera.nombre : null
            };
        });
        res.status(200).json(estudiantesConCarrera);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getEstudianteById = async (req, res) => {
    try {
        const estudiante = await Estudiante.findById(req.params.id).lean();
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }
        const carrera = estudiante.carreraId ? await Carrera.findById(estudiante.carreraId).lean() : null;
        res.json({
            ...estudiante,
            nombreCarrera: carrera ? carrera.nombre : null
        });
    } catch (error) {
        console.error('Error obteniendo estudiante:', error);
        res.status(500).json({ message: 'Error interno al obtener estudiante.' });
    }
};

exports.createEstudiante = async (req, res) => {
    try {
        const { nombre, apellidos, correo, edad, password, direccion, carreraId } = req.body;

        if (!nombre || !apellidos || !correo || !password) {
            return res.status(400).json({ message: 'Nombre, apellidos, correo y password son requeridos.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const estudiante = new Estudiante({
            password: hashedPassword,
            nombre,
            edad,
            apellidos,
            direccion: direccion || '',
            correo,
            carreraId: carreraId || null
        });

        const savedEstudiante = await estudiante.save();
        res.status(201).json({ message: 'Estudiante creado exitosamente.', estudiante: savedEstudiante });
    } catch (error) {
        console.error('Error creando estudiante:', error);
        res.status(500).json({ message: 'Error interno al crear estudiante.' });
    }
};

exports.updateEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellidos, correo, edad, password, direccion, carreraId } = req.body;

        if (!nombre || !apellidos || !correo) {
            return res.status(400).json({ message: 'Nombre, apellidos y correo son requeridos.' });
        }

        const updateData = {
            nombre,
            apellidos,
            edad,
            direccion: direccion || '',
            correo,
            carreraId: carreraId || null
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const estudiante = await Estudiante.findByIdAndUpdate(id, updateData, { new: true });

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
