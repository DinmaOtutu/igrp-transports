const {
    Router
} = require('express')
const UserController = require('../controllers/UserController');
const auth = require('../middlewares/authentication');
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
  deleteVehicle,
  agentDeviceNumber
} = UserController;

// routes
// routes without token
 router.post('/loginAgent', loginAgent);
router.post('/superLogin', loginSuperAgent);

// // authenticated routes
router.use(auth);
// routes that require token

router.put("/updateAgent/:User_id", updateAgent);
router.put("/updateVehicle/:User_id", updateVehicle);
router.post("/createAgent", createAgent);

router.delete("/deleteAgent/:User_id", deleteAgent);
router.patch('/deactivate', deactivateAgent);
router.patch('/activate', activateAgent);
router.post("/createVehicle", createVehicle);
router.get('/agents', allAgents);
router.get("/vehicles", allVehicle);
router.delete("/deleteVehicle/:User_id", deleteVehicle);

router.patch('/updateId', agentDeviceNumber);

// number verification
router.get('/singleAgent/:phoneNumber', singleAgent);
router.get("/singleVehicle/:vrtID", singleVehicle);

module.exports = router;