const express = require('express');
const agentRoutes = require('./user');
const transactionRoutes = require('./transaction');
const ninbvnRoute = require('./ninbvn');
const walletRoutes =  require('./wallet');
const app = express();


app.use('/', agentRoutes);
app.use('/', transactionRoutes);
app.use("/", ninbvnRoute);
app.use('/wallet', walletRoutes);

module.exports = app;
