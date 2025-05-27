const docenteService = require('../../services/administrador/docenteService');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// --- API Docentes ---
exports.getAllDocentes = async (req, res) => {
    try {
        const docentes = await docenteService.getAllDocentes();
        res.json(docentes);
    } catch (error) {
        console.error('Error obteniendo docentes:', error);
        res.status(500).json({ message: 'Error interno al obtener docentes.' });
    }
};

exports.getDocenteById = async (req, res) => {
    try {
        const docente = await docenteService.getDocenteById(req.params.id);
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
        const { nombre, apellido, email, password, edad, telefono, estado, gradoAcademico, cursosAsignados } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'El campo nombre es requerido.' });
        }
        if (!apellido) {
            return res.status(400).json({ message: 'El campo apellido es requerido.' });
        }
        if (!email) {
            return res.status(400).json({ message: 'El campo email es requerido.' });
        }
        if (!password) {
            return res.status(400).json({ message: 'El campo password es requerido.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const docenteData = {
            nombre,
            apellido,
            email,
            password: hashedPassword,
            Edad: edad,
            Telefono: telefono,
            Estado: estado,
            GradoAcademico: gradoAcademico,
            cursosAsignados: cursosAsignados || []
        };

        const docente = await docenteService.createDocente(docenteData);
        res.status(201).json({ message: 'Docente creado exitosamente.', docente });
    } catch (error) {
        console.error('Error creando docente:', error);
        res.status(500).json({ message: 'Error interno al crear docente.' });
    }
};

exports.updateDocente = async (req, res) => {
    try {
        const { nombre, apellido, email, password, edad, telefono, estado, gradoAcademico, cursosAsignados } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'El campo nombre es requerido.' });
        }
        if (!apellido) {
            return res.status(400).json({ message: 'El campo apellido es requerido.' });
        }
        if (!email) {
            return res.status(400).json({ message: 'El campo email es requerido.' });
        }

        const docenteData = {
            nombre,
            apellido,
            email,
            Edad: edad,
            Telefono: telefono,
            Estado: estado,
            GradoAcademico: gradoAcademico,
            cursosAsignados: cursosAsignados || []
        };

        if (password) {
            docenteData.password = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const docente = await docenteService.updateDocente(req.params.id, docenteData);

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
        const docente = await docenteService.deleteDocente(req.params.id);

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
        const cursos = await docenteService.getCoursesForDocente(docenteId);
        res.json(cursos);
    } catch (error) {
        console.error('Error obteniendo cursos:', error);
        res.status(500).json({ message: 'Error obteniendo cursos', error: error.message });
    }
};
