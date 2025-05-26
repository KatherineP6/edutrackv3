const mongoose = require('mongoose');
const Salon = require('../../models/administrador/salonModel');
const Estudiante = require('../../models/administrador/estudianteModel');

// --- Renderizado Vistas ---
exports.renderAdminDashboard = async (req, res) => {
    try {
        const path = req.path;

        // Determine which view to render based on path
        let bodyView = 'dashboard'; // default view filename only
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
        } else {
            // Default to dashboard if no match
            return res.redirect('/admin/dashboard');
        }

        // Fetch counts for dashboard stats
        const totalSalones = await Salon.countDocuments();
        const totalEstudiantes = await Estudiante.countDocuments();

        // Calculate average rendimiento
        const rendimientoResult = await Salon.aggregate([
            {
                $group: {
                    _id: null,
                    averageRendimiento: { $avg: "$rendimiento" }
                }
            }
        ]);

        const averageRendimiento = rendimientoResult.length > 0 ? rendimientoResult[0].averageRendimiento : 0;

        // Calcular ocupación
        const salones = await Salon.find().select('capacidad alumnos').lean();
        const totalCapacidad = salones.reduce((sum, salon) => sum + (salon.capacidad || 0), 0);
        const totalAsignados = salones.reduce((sum, salon) => sum + (salon.alumnos ? salon.alumnos.length : 0), 0);
        const occupancy = totalCapacidad > 0 ? (totalAsignados / totalCapacidad) * 100 : 0;

        return res.render('administrador/menuadministrador', {
            body: bodyView,
            activeSection,
            totalSalones,
            totalEstudiantes,
            averageRendimiento,
            occupancy,
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