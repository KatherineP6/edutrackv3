const Estudiante = require('../../models/administrador/estudianteModel');
const estudiantesService = require('../../services/administrador/estudianteService');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// --- API Estudiantes ---
exports.getAllEstudiantes = async (req, res) => {
    console.log('Sesión usuario:', req.session.userId, req.session.userRole);
      try {
        const estudiante = await estudiantesService.getAllEstudiantes();
        //console.log(docentes); // **No necesitamos esto para la respuesta**
        res.status(200).json(estudiante); // **Enviamos la respuesta como JSON**
      } catch (error) {
        console.error('Error al obtener estudiante:', error);
        res.status(500).json({ "error": error.message }); // **Enviamos el error como JSON**
      }
  /*  try {
        const estudiantes = await Estudiante.find().lean();
        res.json(estudiantes);
    } catch (error) {
        console.error('Error obteniendo estudiantes:', error);
        res.status(500).json({ message: 'Error interno al obtener estudiantes.' });
    }*/
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
        const { nombre, apellidos, correo, edad } = req.body;

        if (!nombre || !apellidos || !correo || !edad) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }
        var password=nombre;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        var direccion ="";
        var telefono ="";
        var estado ="";
        var salon ="";
        var documentos ="";
        

        const estudiante = new Estudiante({
            password: hashedPassword,
            Nombre:nombre,
            Edad:edad,
            Apellidos:apellidos,
            direccion,
            telefono,
            estado,
            salon,
            documentos,
            correo,
                        
        });

        const savedCarrera = await estudiante.save();
        res.status(201).json({ message: 'Estudiante creado exitosamente.', estudiante });
    } catch (error) {
        console.error('Error creando estudiante:', error);
        res.status(500).json({ message: 'Error interno al crear estudiante.' });
    }
};

exports.updateEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellidos, correo, edad } = req.body;

        if (!nombre || !apellidos || !correo) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const estudiante = await Estudiante.findByIdAndUpdate(
            id,
            { Nombre:nombre, Apellidos:apellidos, edad,correo },
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
