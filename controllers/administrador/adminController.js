const mongoose = require('mongoose');
const Salon = require('../../models/administrador/salonModel');
const Estudiante = require('../../models/administrador/estudianteModel');
const Docente = require('../../models/administrador/docenteModel');
const Carrera = require('../../models/administrador/carreraModel');
const Bloque = require('../../models/administrador/bloqueModel');

// --- Renderizado Vistas ---
exports.renderAdminDashboard = async (req, res) => {
    try {
        const path = req.path;

        // Determinar la vista a renderizar
        let bodyView = 'dashboard'; // vista por defecto
        let activeSection = 'dashboard';

        if (path.includes('/dashboard')) {
            bodyView = 'dashboard';
            activeSection = 'dashboard';
        } else if (path.includes('/salones')) {
            bodyView = 'ver-salones';
            activeSection = 'salones';
        } else if (path.includes('/estudiantes')) {
            bodyView = 'ver-estudiantes';
            activeSection = 'estudiantes';
        } else if (path.includes('/docentes')) {
            bodyView = 'ver-docentes';
            activeSection = 'docentes';
        } else if (path.includes('/reportes')) {
            bodyView = 'generar-reportes';
            activeSection = 'reportes';
        } else if (path.includes('/cursos')) {
            bodyView = 'ver-cursos';
            activeSection = 'cursos';
        } else if (path.includes('/carreras')) {
            bodyView = 'ver-carreras';
            activeSection = 'carreras';
        } else if (path.includes('/bloques')) {
            bodyView = 'ver-bloques';
            activeSection = 'bloques';
        } else if (path.includes('/soporte')) {
            bodyView = 'ver-agentesoporte';
            activeSection = 'soporte';
        } else {
            // Redirigir por defecto al dashboard
            return res.redirect('/admin/dashboard');
        }

        // Obtener totales
        const [totalSalones, totalEstudiantes, totalDocentes, totalCarreras] = await Promise.all([
            Salon.countDocuments(),
            Estudiante.countDocuments(),
            Docente.countDocuments(),
            Carrera.countDocuments(),
            Salon.countDocuments(),
            Bloque.countDocuments(),

        ]);

        // Obtener las carreras con más estudiantes (Top 5)
        const topCarreras = await Estudiante.aggregate([
            { $group: { _id: "$carrera", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "carreras",
                    localField: "_id",
                    foreignField: "_id",
                    as: "carrera"
                }
            },
            { $unwind: "$carrera" },
            {
                $project: {
                    nombreCarrera: "$carrera.nombre",
                    numeroEstudiantes: "$count"
                }
            }
        ]);

        // Renderizar vista con datos
        return res.render('administrador/menuadministrador', {
            body: bodyView,
            activeSection,
            totalSalones,
            totalEstudiantes,
            totalDocentes,
            totalCarreras,
            totalBloques,
            topCarreras,
            user: {
                role: req.session.userRole,
                email: req.session.email,
                name: req.session.userName || 'Usuario'
            }
        });

    } catch (error) {
        console.error("Error al renderizar la vista administrativa:", error);
        res.status(500).send("Error interno del servidor.");
    }
};
