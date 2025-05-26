const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');
const { db } = require('../config');

async function createAdmin() {
    try {
        await mongoose.connect(db.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión exitosa a MongoDB Atlas');

        const adminData = {
            nombre: 'Admin',
            apellido: 'Principal',
            correo: 'admin@edutrack360.com',
            password: 'admin123',
            telefono: '123456789',
            direccion: 'Dirección Principal'
        };

        const existingAdmin = await Admin.findOne({ correo: adminData.correo });
        if (existingAdmin) {
            console.log('Ya existe un administrador con ese correo.');
            return;
        }

        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        adminData.password = hashedPassword;

        const admin = new Admin(adminData);
        await admin.save();

        console.log('Administrador creado exitosamente.');
        console.log('Correo:', adminData.correo);
        console.log('Contraseña:', 'admin123');
    } catch (error) {
        console.error('Error al crear el administrador:', error);
    } finally {
        mongoose.connection.close();
    }
}

createAdmin();
