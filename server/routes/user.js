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
  createVehicle,
  allAgents,
  allVehicle,
  singleAgent,
  singleVehicle,
  updateVehicle,
  agentDeviceNumber
} = UserController;

// routes
// routes without token
 router.post('/loginAgent', loginAgent);
router.post('/superLogin', loginSuperAgent);

// // authenticated routes
// router.use(auth);
// routes that require token

router.patch('/updateAgent', updateAgent);
router.patch('/updateVehicle', updateVehicle);
router.post("/createAgent", createAgent);

router.delete('/deleteAgent/:phoneNumber', deleteAgent);
router.patch('/deactivate', deactivateAgent);
router.patch('/activate', activateAgent);
router.post("/createVehicle", createVehicle);
router.get('/agents', allAgents);
router.get("/vehicles", allVehicle);
router.patch('/updateId', agentDeviceNumber);

// number verification
// router.use(numberChecker);

router.get('/singleAgent/:phoneNumber', singleAgent);
router.get("/singleVehicle/:vrtID", singleVehicle);

module.exports = router;