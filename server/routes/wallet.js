const { Router } = require('express')
const auth = require('../middlewares/authentication');
const SettingController = require('../controllers/SettingController');
const  WalletController = require('../controllers/WalletController');

const router = Router();

const { activatedWallet, walletCodeReset, walletCodeRecovery } = WalletController;
const { addBankData, removeBankData } = SettingController;

router.use(auth);
router.put('/addbank', addBankData);
router.put('/removebank', removeBankData);
router.put('/activatewallet',activatedWallet);
router.put('/walletcodereset', walletCodeReset);
router.put('/walletcoderecovery', walletCodeRecovery);


module.exports = router;