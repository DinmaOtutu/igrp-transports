const {
    Router
} = require('express')
const auth = require('../middlewares/authentication');
const WalletController = require('../controllers/WalletController');
const SettingController = require('../controllers/SettingController');
const router = Router();

const { activateWallet, walletCodeReset, walletCodeRecovery } = WalletController
const { addBankData, removeBankData } = SettingController;

router.use(auth);

router.put('/activateWallet', activateWallet);
router.put('/addbank', addBankData);
router.put('/removebank', removeBankData);
router.put('/walletcodereset', walletCodeReset);
router.put('/walletcoderecovery', walletCodeRecovery);

module.exports = router;
