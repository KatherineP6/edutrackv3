const Docente = require('../../models/administrador/docenteModel');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// --- API Docentes ---
exports.getAllDocentes = async (req, res) => {
    try {
        const docentes = await Docente.find().lean();
        res.json(docentes);
    } catch (error) {
        console.error('Error obteniendo docentes:', error);
        res.status(500).json({ message: 'Error interno al obtener docentes.' });
    }
};

exports.getDocenteById = async (req, res) => {
    try {
        const docente = await Docente.findById(req.params.id);
        if (!docente) {
            return res.status(404).json({ message: 'Docente no encontrado.' });
        }
        res.json(docente);
    } catch (error) {
        console.error('Error obteniendo docente:', error);
        res.status(500).json({ message: 'Error interno al obtener docente.' });
    }
};

exports.createDocente = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;

        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const docente = new Docente({
            nombre,
            apellido,
            email,
            password: hashedPassword
        });

        await docente.save();
        res.status(201).json({ message: 'Docente creado exitosamente.', docente });
    } catch (error) {
        console.error('Error creando docente:', error);
        res.status(500).json({ message: 'Error interno al crear docente.' });
    }
};

exports.updateDocente = async (req, res) => {
    try {
        const { nombre, apellido, email } = req.body;

        if (!nombre || !apellido || !email) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const docente = await Docente.findByIdAndUpdate(
            req.params.id,
            { nombre, apellido, email },
            { new: true }
        );

        if (!docente) {
            return res.status(404).json({ message: 'Docente no encontrado.' });
        }

        res.json({ message: 'Docente actualizado exitosamente.', docente });
    } catch (error) {
        console.error('Error actualizando docente:', error);
        res.status(500).json({ message: 'Error interno al actualizar docente.' });
    }
};

exports.deleteDocente = async (req, res) => {
    try {
        const docente = await Docente.findByIdAndDelete(req.params.id);

        if (!docente) {
            return res.status(404).json({ message: 'Docente no encontrado.' });
        }

        res.json({ message: 'Docente eliminado exitosamente.' });
    } catch (error) {
        console.error('Error eliminando docente:', error);
        res.status(500).json({ message: 'Error interno al eliminar docente.' });
    }
};

exports.getCoursesForDocente = async (req, res) => {
    try {
        const docenteId = req.session.userId;
        const cursos = await Salon.find({ docente: docenteId }).populate('docente').lean();
        res.json(cursos);
    } catch (error) {
        console.error('Error obteniendo cursos:', error);
        res.status(500).json({ message: 'Error obteniendo cursos', error: error.message });
    }
};