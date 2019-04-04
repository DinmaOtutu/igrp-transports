const { Router } = require('express')
const auth = require('../middlewares/authentication');
const SettingController = require('../controllers/SettingController');
const  WalletController = require('../controllers/WalletController')
const InstapayController = require('../controllers/InstapayController');

const router = Router();

const { activatedWallet, walletCodeReset, walletCodeRecovery, checkBalance, sendMoney } = WalletController;
const { addBankData, removeBankData } = SettingController;
const { getBankList, creditWallet, bankTransfer, webHook } = InstapayController

router.use(auth);
router.put('/addbank', addBankData);
router.put('/removebank', removeBankData);
router.put('/activatewallet', activatedWallet);
router.put('/walletcodereset', walletCodeReset);
router.put('/walletcoderecovery', walletCodeRecovery);
router.get('/checkbalance', checkBalance);
router.post('/sendmoney', sendMoney);
router.post('/fundwallet', creditWallet);
router.post('/debitwallet', bankTransfer);
router.get('/banklist', getBankList);


module.exports = router;