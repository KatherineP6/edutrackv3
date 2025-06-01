const Carrera = require('../../models/administrador/carreraModel');

const carreraService = require('../../services/administrador/carreraService');

exports.renderCarrerasPage = (req, res) => {
  res.render('administrador/menuadministrador', {
    activeSection: 'carreras',
    user: req.session.user || {},
    body: 'administrador/_ver-carreras'
  });
};

exports.getAllCarrera = async (req, res) => {
  console.log('Sesión usuario:', req.session.userId, req.session.userRole);
  try {
    const carreras = await carreraService.getAllCarrera();
    
    res.status(200).json(carreras); 
  } catch (error) {
    console.error('Error al obtener docentes:', error);
    res.status(500).json({ "error": error.message }); 
  }
 
};

exports.createCarrera = async (req, res) => {
  try {
    const { nombre, descripcion, duracionSem, precio } = req.body;
    const nuevaCarrera = new Carrera({ nombre, descripcion, duracionSem, precio });
    const savedCarrera = await nuevaCarrera.save();
    res.status(201).json(savedCarrera);
  } catch (error) {
    console.error('Error creating carrera:', error);
    res.status(500).json({ message: 'Error al crear la carrera' });
  }
};

exports.updateCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, duracionSem, precio } = req.body;
    const updatedCarrera = await Carrera.findByIdAndUpdate(
      id,
      { nombre, descripcion, duracionSem, precio },
      { new: true }
    );
    if (!updatedCarrera) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }
    res.json(updatedCarrera);
  } catch (error) {
    console.error('Error updating carrera:', error);
    res.status(500).json({ message: 'Error al actualizar la carrera' });
  }
};

exports.deleteCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCarrera = await Carrera.findByIdAndDelete(id);
    if (!deletedCarrera) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }
    res.json({ message: 'Carrera eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting carrera:', error);
    res.status(500).json({ message: 'Error al eliminar la carrera' });
  }
};

exports.getAllCarreraPublic = async (req, res) => {
  try {
    const carreras = await Carrera.find().lean();
    res.status(200).json(carreras);
  } catch (error) {
    console.error('Error al obtener carreras públicas:', error);
    res.status(500).json({ message: 'Error al obtener las carreras públicas' });
  }
};
