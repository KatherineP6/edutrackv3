const Estudiante = require('../../models/administrador/estudianteModel');
const estudianteService = require('../../services/administrador/estudianteService');

exports.getAllEstudiantes = async (req, res) => {
/*    try {
        const estudiantes = await estudianteService.getAllEstudiantes();
        res.json(estudiantes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }*/
};


exports.getSeguimientoData = async (req, res) => {
    try {
        const studentId = req.session.userId;
        const rendimiento = await estudianteService.getPerformanceData(studentId);
        const asistencia = await estudianteService.getAttendanceData(studentId);
        res.json({ rendimiento, asistencia });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};