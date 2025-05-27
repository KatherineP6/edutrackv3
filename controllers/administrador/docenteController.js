const Docente = require('../../models/administrador/docenteModel');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// --- API Docentes ---
exports.getAllDocentes = async (req, res) => {
    try {
        const docentes = await Docente.find().populate('cursosAsignados').lean();

        // Send cursosAsignados as array of objects {_id, nombre}
        const docentesConCursos = docentes.map(docente => {
            const cursos = Array.isArray(docente.cursosAsignados)
                ? docente.cursosAsignados.map(curso => ({
                    _id: curso._id.toString(),
                    nombre: curso.nombre || 'Nombre no disponible'
                }))
                : [];
            return {
                ...docente,
                cursosAsignados: cursos
            };
        });

        res.status(200).json(docentesConCursos);
    } catch (error) {
        console.error('Error al obtener docentes:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getDocenteById = async (req, res) => {
    try {
        const docente = await Docente.findById(req.params.id).lean();
        
        if (!docente) {
            return res.status(404).json({ message: 'Docente no encontrado.' });
            
        }
        const docentesConCursos = docentes.map(docente => {
            const cursos = Array.isArray(docente.cursosAsignados)
                ? docente.cursosAsignados.map(curso => ({
                    _id: curso._id.toString(),
                    nombre: curso.nombre || 'Nombre no disponible'
                }))
                : [];
            return {
                ...docente,
                cursosAsignados: cursos
            };
        });
      //  res.json(docente);
      res.json(docentesConCursos);
    } catch (error) {
        console.error('Error obteniendo docente:', error);
        res.status(500).json({ message: 'Error interno al obtener docente.' });
    }
};

exports.createDocente = async (req, res) => {
    try {
        const { nombre, apellido, correo, password, edad, telefono, estado, gradoAcademico, cursosAsignados } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({ message: 'Nombre, correo y password son requeridos.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const docente = new Docente({
            nombre,
            apellido: apellido || '',
            correo,
            password: hashedPassword,
            edad: edad || '',
            telefono: telefono || '',
            estado: typeof estado === 'boolean' ? estado : true,
            gradoAcademico: gradoAcademico || '',
            cursosAsignados: cursosAsignados || []
        });

        const savedDocente = await docente.save();
        res.status(201).json({ message: 'Docente creado exitosamente.', docente: savedDocente });
    } catch (error) {
        console.error('Error creando docente:', error);
        res.status(500).json({ message: 'Error interno al crear docente.' });
    }
};

exports.updateDocente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, correo, password, edad, telefono, estado, gradoAcademico, cursosAsignados } = req.body;

        if (!nombre || !correo) {
            return res.status(400).json({ message: 'Nombre y correo son requeridos.' });
        }

        const updateData = {
            nombre,
            apellido: apellido || '',
            correo,
            edad: edad || '',
            telefono: telefono || '',
            estado: typeof estado === 'boolean' ? estado : true,
            gradoAcademico: gradoAcademico || '',
            cursosAsignados: cursosAsignados || []
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const docente = await Docente.findByIdAndUpdate(id, updateData, { new: true });

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
