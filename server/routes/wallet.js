const {
    Router
} = require('express')
const auth = require('../middlewares/authentication');
const WalletController = require('../controllers/WalletController');
const router = Router();

const { activateWallet } = WalletController
router.use(auth);

router.put('/activateWallet', activateWallet);

module.exports = router;
