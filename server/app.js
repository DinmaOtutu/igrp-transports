const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/index.js');
const routes = require('./routes');
const UsersController = require('./controllers/UserController');


// initiate app
const app = express();

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
 extended: false
}));

// connect to mongodb
// const mongoURL = process.env.NODE_ENV === 'test' ? process.env.DB_URL_TEST : process.env.NODE_ENV === 'production' ? process.env.DB_URL_PROD : process.env.DB_URL_DEV;
mongoose.connect(config.MONGODB_DATABASE, {
 useNewUrlParser: true,
 useCreateIndex: true,
 useFindAndModify: false
}, () => {
 process.stdout.write('connected to mongodb');
});
app.get('/api', (req, res) => {
 res.json('Welcome to IGR Api');
});

(async () => {
  console.log('I was created here')
  return await UsersController.createSuperAgent();
})();

// routes
app.use('/api', routes);

// catch all unseen error
app.use('*', (req, res, next) => {
 res.status(404).json({
   message: 'Page not found',
 });
 next();
});

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
 process.stdout.write(`app is listening on port ${PORT}`)
});