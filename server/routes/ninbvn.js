const { Router }=  require('express');
const BvnandNinController = require('../controllers/bvnandnincontroller');
const router = Router();
const auth = require("../middlewares/validation");

//destructuring
const { validateNin, confirmBvn } = BvnandNinController;


// Validate BVN
router.post('/validateBvn', confirmBvn);

//validateNIN
router.post('/validateNin', validateNin);

module.exports = router;