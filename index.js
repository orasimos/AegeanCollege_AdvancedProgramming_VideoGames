const path = require("path");
const morgan = require('morgan');
const express = require('express');

const videogameRoutes = require('./routes/videogameRoutes');
const userRoutes = require('./routes/authRoutes');
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// ROUTES
app.use('/api/videogames', videogameRoutes);
app.use('/api/auth', userRoutes)
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;