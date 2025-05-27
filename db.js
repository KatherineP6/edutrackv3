const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado a MongoDB Atlas exitossamente');
})
.catch((error) => {
  console.error('❌ Error al conectar a MongoDB Atlas:', error);
});

module.exports = mongoose;
