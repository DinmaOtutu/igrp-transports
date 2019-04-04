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
router.put('/activatewallet', async (req, res) => {
    try {
        const jwttoken = req.headers.authorization || req.headers['x-access-token'];
        const decoded = jwt.decode(jwttoken);
  
        const {
          phoneNumber
        } = decoded;
  
     const wallet = await Wallet.findOne({ phoneNumber });
     if (!wallet) {
        return res.status(400).json(responses.error(400, 'Unable to find user'));
      }
      const {
        passCode,
        securityQuestion,
        securityAnswer
      } = req.body;

      if (!passCode || !securityQuestion || !securityAnswer) return res.status(400).json(responses.error(400, 'All fields are required'));
      const retrievedWallet = await Wallet.findOne({
        phoneNumber
      });
      if (!retrievedWallet) {
        return res.status(404).json(responses.error(404, 'User not found'));
      }
      if (retrievedWallet.isActivated) return res.status(400).json(responses.error(400, 'Your wallet is already activated'));
      const {
        hashData
      } = DataProtector;
      const updatedWallet = await Wallet.findOneAndUpdate({
        phoneNumber
      }, {
        $set: {
          passCode: hashData(passCode),
          securityQuestion,
          securityAnswer: hashData(securityAnswer),
          isActivated: true
        }
      }, {
        new: true
      });
      return res.status(200).json(responses.success(200, 'Wallet successfully activated', updatedWallet));
    } catch (error) {
      return res.status(500).json(
        responses.error(500, 'Server error, failed to activate wallet')
      );
    }
  });
router.put('/walletcodereset', async (req, res) => {
    try {
        const jwttoken = req.headers.authorization || req.headers['x-access-token'];
        const decoded = jwt.decode(jwttoken);
  
        const {
          phoneNumber
        } = decoded;
  
     const wallet = await Wallet.findOne({ phoneNumber });
     if (!wallet) {
        return res.status(400).json(responses.error(400, 'Unable to find user'));
      }
      const {
        previousCode,
        newCode
      } = req.body;
      const {
        hashData,
        compareData
      } = DataProtector;
      const retrievedWallet = await Wallet.findOne({
        phoneNumber
      });
      if (!retrievedWallet) {
        return res.status(404).json(responses.error(404, 'Wallet doesn\'t exist'));
      }
      if (!retrievedWallet.isActivated) return res.status(401).json(responses.error(401, 'Your wallet is not yet activated'));
      if (!compareData(previousCode, retrievedWallet.passCode)) {
        return res.status(401).json(responses.error(401, 'Previous passcode entered is incorrect'));
      }
      const updatedWallet = await Wallet.findOneAndUpdate({
        phoneNumber
      }, {
        $set: {
          passCode: hashData(newCode),
        }
      }, {
        new: true
      });
      return res.status(200).json(responses.success(200, 'Passcode reset successful', updatedWallet));
    } catch (error) {
        return res.status(500).json(
            responses.error(500, 'Server error, failed to activate wallet'));
    }
  }
);
router.put('/walletcoderecovery', async (req, res) => {
    try{
      const jwttoken = req.headers.authorization || req.headers['x-access-token'];
      const decoded = jwt.decode(jwttoken);
  
      const {
        phoneNumber
      } = decoded;
  
   const wallet = await Wallet.findOne({ phoneNumber });
   if (!wallet) {
      return res.status(400).json(responses.error(400, 'Unable to find user'));
    }
      const {
        securityAnswer,
        newCode,
        confirmNewCode
      } = req.body;
      if (newCode.trim() !== confirmNewCode.trim()) return res.status(400).json(responses.error(400, 'Code does not match'));
      const {
        hashData,
        compareData
      } = DataProtector;
      const retrievedWallet = await Wallet.findOne({
        phoneNumber
      });
      if (!retrievedWallet) {
        return res.status(404).json(responses.error(404, 'Wallet doesn\'t exist'));
      }
      if (!retrievedWallet.isActivated) return res.status(401).json(responses.error(401, 'Your wallet is not yet activated'));
      if (!compareData(securityAnswer, retrievedWallet.securityAnswer)) {
        return res.status(401).json(responses.error(401, 'Security answer provided is incorrect, contact support'));
      }
      const updatedWallet = await Wallet.findOneAndUpdate({
        phoneNumber
      }, {
        $set: {
          passCode: hashData(newCode),
          resetCode: true
        }
      }, {
        new: true
      });
      return res.status(200).json(responses.success(200, 'Passcode recovery successful', updatedWallet));
    } catch(error) {
        return res.status(500).json(
          responses.error(500, 'Server error, failed to activate wallet'));
    }
  }
);

module.exports = router;