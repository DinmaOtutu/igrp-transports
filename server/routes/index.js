const express = require('express');
const agentRoutes = require('./user');
// const transactionRoutes = require('./transaction');
const app = express();


app.use('/', agentRoutes);
app.use('/', transactionRoutes);


module.exports = app;
