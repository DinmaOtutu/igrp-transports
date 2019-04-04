const { Router }=  require('express');
const BvnandNinController = require('../controllers/bvnandnincontroller');
const router = Router();
const auth = require("../middlewares/validation");

//destructuring
const { validateNin, confirmBvn } = BvnandNinController;


// Validate BVN
router.post('/validateBvn/:bvn', confirmBvn);

//validateNIN
router.get("/validateNin/:regNo", validateNin);

module.exports = router;