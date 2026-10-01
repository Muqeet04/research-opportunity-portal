const express = require('express');
const cors = require('cors');
const path = require('path');
const opportunityRoutes = require('./routes/opportunityRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/opportunities', opportunityRoutes);

app.use(express.static(path.join(__dirname, '../frontend')));

module.exports = app;
