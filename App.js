const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

// Inicialización de la aplicación
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Importación de rutas
const proveedorRoutes = require('./routes/proveedorRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const productoRoutes = require('./routes/productoRoutes'); 

const ventaRoutes = require('./routes/ventaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');


// Rutas principales
app.get('/', (req, res) => {
  res.send('Bienvenido a mi API');
});

// Configuración de rutas
app.use('/proveedores', proveedorRoutes);
app.use('/clientes', clienteRoutes);
app.use('/productos', productoRoutes);

app.use('/ventas', ventaRoutes);
app.use('/Usuarios', usuarioRoutes); // Asegúrate de que este prefijo coincida con el usado en `routes/usuarioRoutes.js`

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(error => console.error('Error de conexión a MongoDB:', error));

// Escucha del servidor
app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
