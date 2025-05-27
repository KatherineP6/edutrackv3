// ... existing imports and setup ...

const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const socket = require('socket.io');
const sharedsession = require("express-socket.io-session"); // Add this
const docenteRouters = require('./routers/administrador/docenteRouters');

// Importar middlewares
const userLogin = require('./middlewares/comun/userLogin');

// Importar controladores
const loginController = require('./controllers/comun/loginController');

// Importar conexión a la base de datos
const connection = require('./database/connection');

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para logging
app.use(morgan('dev'));

// Middlewares para procesar solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión
const sessionMiddleware = session({
    secret: 'EduTrack360_SecretKey_2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
});
app.use(sessionMiddleware);

// Configuración de flash messages
app.use(flash());

// Variables globales para las vistas
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('comun/index', {
        title: 'EduTrack360',
        message: 'Bienvenido a EduTrack360',
        showMessage: true
    });
});

// Rutas de autenticación
app.get('/login', loginController.showLoginForm);
app.post('/login', loginController.processLogin);

// Rutas del administrador (protegidas por middleware de autenticación)
app.use('/admin', userLogin, require('./routers/administrador/adminRouters'));
app.use('/admin/cursos', userLogin, require('./routers/administrador/cursoRouters'));

// Montar router comun/userRouters para rutas de usuario, incluyendo /logout
app.use('/', require('./routers/comun/userRouters'));

// Montar router para rutas de estudiante (vistas)
app.use('/estudiante', userLogin, require('./routers/administrador/estudianteRouters'));

// Montar router para rutas API de estudiante
app.use('/api/estudiantes', userLogin, require('./routers/administrador/estudianteRouters'));

// API Routes
app.use('/api/docentes', userLogin, require('./routers/administrador/docenteRouters'));
app.use('/api/salones', userLogin, require('./routers/administrador/salonRouters'));
app.use('/api/cursos', userLogin, require('./routers/administrador/cursoRouters'));
app.use('/api/carreras', userLogin, require('./routers/administrador/carreraRouters'));

// Route for docente dashboard
app.use('/docente', userLogin, docenteRouters);

// Crear servidor HTTP y usar socket.io
const server = require('http').createServer(app);
const io = socket(server);

// Integrar sesión con socket.io
io.use(sharedsession(sessionMiddleware, {
    autoSave:true
}));

// Integración de Socket.IO
require('./socket')(io);

// Iniciar el servidor en el puerto 3000
const port = 3000;
server.listen(port, () => {
    console.log(`Aplicación con express ejecutándose en el puerto http://localhost:${port}`);
    console.log(`http://localhost:${port}/socket.io/socket.io.js`);
});

// Ruta para el Chatbot
app.get('/chatbot', (req, res) => {
    const user = {
        name: req.session.userName || '',
        email: req.session.email || '',
        role: req.session.userRole || ''
    };
    console.log('Usuario pasado a la vista chatbot:', user);
    res.render('chatbot', { user });  
});
