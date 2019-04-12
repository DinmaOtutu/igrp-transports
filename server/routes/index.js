const express = require('express');
const agentRoutes = require('./user');
const transactionRoutes = require('./transaction');
const walletRoutes = require('./wallet');
const ninbvnRoute = require('./ninbvn');

const app = express();

app.use('/wallet', walletRoutes);
app.use('/', agentRoutes);
app.use('/', transactionRoutes);
app.use('/', ninbvnRoute);

module.exports = app;
