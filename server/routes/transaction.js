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
    getDriverTrips
} = TransactionController;

// authenticate routes
router.use(auth);

// routes
router.post('/createTransaction', createTransaction);
router.get('/transactions', getTransactions);

// number validation 
router.use(numberChecker)
router.get('/agentTransaction/:agentNumber', numberChecker, getAgentTransaction);
router.get('/driverTransaction/:driverNumber', numberChecker, getDriverTrips);

module.exports = router;