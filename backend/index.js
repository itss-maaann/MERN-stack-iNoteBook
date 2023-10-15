const express = require('express');
// import express from 'express'
const connectToMongo = require('./db');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/noteRoutes');

const app = express();
const port = 5000;

// Connect to MongoDB
connectToMongo();

// Middleware
app.use(express.json());

// Route Prefixes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', notesRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
