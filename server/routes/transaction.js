const {
    Router
} = require('express')
const TransactionController = require('../controllers/TransactionController');
const auth = require('../middlewares/authentication');
const numberChecker = require('../middlewares/validation');

const router = Router();

const {
  createTransaction,
  getTransactions,
  getAgentTransaction,
  getVehicleTrips
} = TransactionController;

// authenticate routes
router.use(auth);

// routes
router.post('/createTransaction', createTransaction);
router.get('/transactions', getTransactions);

// number validation 
router.get('/agentTransaction/:agentNumber', numberChecker, getAgentTransaction);
router.get("/vehicleTransaction/:vrtID", numberChecker, getVehicleTrips);

module.exports = router;