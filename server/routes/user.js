const {
    Router
} = require('express')
const UserController = require('../controllers/UserController');
const auth = require('../middlewares/authentication');
const numberChecker = require('../middlewares/validation');
const router = Router();

// destructuring
const {
    loginSuperAgent,
    createAgent,
    updateAgent,
    deleteAgent,
    deactivateAgent,
    activateAgent,
    loginAgent,
    createDriver,
    allAgents,
    allDrivers,
    singleAgent,
    singleDriver,
    agentDeviceNumber
} = UserController;

// routes
// routes without token
 router.post('/loginAgent', loginAgent);
router.post('/superLogin', loginSuperAgent);

// // authenticated routes
router.use(auth);
// routes that require token
router.post('/createAgent', createAgent);
router.put('/updateAgent', updateAgent);
router.delete('/deleteAgent', deleteAgent);
router.put('/deactivate', deactivateAgent);
router.put('/activate', activateAgent);
router.post('/createDriver', createDriver);
router.get('/agents', allAgents);
router.get('/drivers', allDrivers);
router.patch('/updateId', agentDeviceNumber);

// number verification
router.use(numberChecker);
router.get('/singleAgent/:phoneNumber', singleAgent);
router.get('/singleDriver/:phoneNumber',singleDriver);

module.exports = router;