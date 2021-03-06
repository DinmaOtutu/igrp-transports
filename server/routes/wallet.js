const { Router } = require('express')
const auth = require('../middlewares/authentication');
const SettingController = require('../controllers/SettingController');
const  WalletController = require('../controllers/WalletController')
const InstapayController = require('../controllers/InstapayController');
const TransactionHistoryController = require('../controllers/TransactionHistoryController');

const router = Router();

const { activatedWallet, walletCodeReset, walletCodeRecovery, checkBalance, sendMoney } = WalletController;
const { addBankData, removeBankData } = SettingController;
const { getBankList, creditWallet, bankTransfer, webHook } = InstapayController;
const { getTransactionHistory } = TransactionHistoryController;

// webhook 
router.post('/webhook', webHook);

router.use(auth);
// authenticated routes
router.post('/fundwallet', creditWallet);
router.put('/addbank', addBankData);
router.put('/removebank', removeBankData);
router.put('/activatewallet',  activatedWallet);
router.put('/walletcodereset', walletCodeReset);
router.put('/walletcoderecovery',  walletCodeRecovery);
router.get('/checkbalance',  checkBalance);
router.post('/sendmoney',  sendMoney);
router.post('/debitwallet', bankTransfer);
router.get('/banklist', getBankList);
router.get('/transactionHistory', getTransactionHistory);


module.exports = router;