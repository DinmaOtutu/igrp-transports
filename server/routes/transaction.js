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
  getVehicleTrips,
  debitOffline
} = TransactionController;

// authenticate routes
;

// routes
router.post('/createTransaction', auth, createTransaction);
router.get('/transactions', auth, getTransactions);
router.put('/debitOffline', auth, debitOffline);

// number validation 
router.get('/agentTransaction/:agentNumber', auth, numberChecker, getAgentTransaction);
router.get("/vehicleTransaction/:vrtID", auth, numberChecker, getVehicleTrips);



module.exports = router;