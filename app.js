const express = require('express');
const bodyParser = require('body-parser');
const morgan =  require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./server/config/index');
const routes = require('./server/routes');
const UsersController = require('./server/controllers/UserController');


// initiate app
const app = express();
dotenv.config();
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
 extended: false
}));

// enable cors
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,x-auth,Accept,content-type,application/json');
  next();
});

// morgan
app.use(morgan('tiny'))
// connect to mongodb
 const mongoURL = process.env.NODE_ENV === 'test' ? config.DB_URL_TEST : process.env.NODE_ENV === 'production' ? process.env.DB_URL_PROD : process.env.DB_URL;
mongoose.connect(mongoURL, {
 useNewUrlParser: true,
 useCreateIndex: true,
 useFindAndModify: false
}, () => {
 process.stdout.write('connected to mongodb');
});
app.get('/api', (req, res) => {
 res.json('Welcome to IGR Api');
});
(async () =>  await UsersController.createSuperAgent())();

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