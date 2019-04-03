/* eslint-disable max-len */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Wallet = require('../models/Wallet');
const responses = require('../utils/responses');
const DataProtector = require('../utils/dataProtector');

/**
 * @description Defines the actions to for the wallet endpoints
 * @class WalletController
 */
class WalletController {
  /**
   *@description Creates a new wallet for a new user
   *@static
   *@param  {Object} userPhoneNumber - request
   *@returns {object} - null
   *@memberof walletController
   */
  static async newWallet(userPhoneNumber) {
    const newWallet = await Wallet.create({
      phoneNumber: userPhoneNumber
    });
    if (!newWallet) throw new Error();
  }

  /**
   *@description Activates a user's wallet
   *@static
   *@param  {Object} req - request
   *@param  {Object} res - request
   *@returns {object} - null
   *@memberof walletController
   */
  static async activateWallet(req, res) {
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
  }


  /**
   *@description Debits and credits users
   *@static
   *@param  {Number} senderNumber - phone number of the sender
   *@param  {Number} senderNewBalance - sender's new balance
   *@param  {Number} receiverNumber - phone number of the receiver
   *@param  {Number} receiverNewBalance - receiver's new balance
   *@returns {object} - updated sender's and receiver's details
   *@memberof walletController
   */
  static async moneyDeductions({
    senderNumber,
    senderNewBalance,
    receiverNumber,
    receiverNewBalance
  }) {
    try {
      const updatedSender = await Wallet.findOneAndUpdate({
        phoneNumber: senderNumber
      }, {
        totalAmount: senderNewBalance
      }, {
        new: true
      });
      const updatedReceiver = await Wallet.findOneAndUpdate({
        phoneNumber: receiverNumber
      }, {
        totalAmount: receiverNewBalance
      }, {
        new: true
      });

      return {
        updatedSender,
        updatedReceiver
      };
    } catch (error) {
        return res.status(500).json(
            responses.error(500, 'Server error, failed to activate wallet'))
    }
  }

  /**
   *@description Reset user passcode
   *@static
   *@param  {Object} req - request
   *@param  {Object} res - request
   *@returns {object} - null
   *@memberof walletController
   */
  static async walletCodeReset(req, res) {
    try {
      const {
        phoneNumber,
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

  /**
   *@description Recover a user's passcode
   *@static
   *@param  {Object} req - request
   *@param  {Object} res - request
   *@returns {object} - null
   *@memberof walletController
   */
  static async walletCodeRecovery(req, res) {
    const {
      phoneNumber,
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
  }

  /**
     *@description Check wallet balance
     *@static
     *@param  {Object} req - request
     *@param  {object} res - response
     *@returns {object} - status code, message and wallet balance
     *@memberof UsersController
     */
  static async checkBalance(req, res) {
    const { phoneNumber } = req.params;
    const walletBalance = await Wallet.findOne({ phoneNumber });
    try {
      const wallet = await Wallet.findOne({ phoneNumber: req.params.phoneNumber })
        .select('totalAmount');
      if (!wallet) {
        return res.status(404).json(responses.error(404, 'Wallet Not Found '));
      }
      if (wallet.isActivated === false) {
        return res.status(400).json(responses.error(400, 'please activate your wallet'));
      }
      return res.status(200).json(
        responses.success(200, 'Balance retrieved successfully', walletBalance)
      );
    } catch (error) {
      // this will  be handled by the error handling middleware
      return res.status(500).json(
        responses.error(500, 'Server error, failed to activate wallet'));
    }
  }

  /**
   *@description confirm if a users wallet is activated
   *@static
   *@param  {Object} req - request
   *@param  {Object} res - request
   *@returns {object} - user's wallent amount
   *@memberof walletController
   */
  static async isWalletActivated(req, res) {
    try {
      const jwttoken = req.headers.authorization || req.headers['x-access-token'];
      const decoded = jwt.decode(jwttoken);

      const {
        phoneNumber
      } = decoded;

      const wallet = await SettingController.retrieveWallet(res, phoneNumber);
      if (!wallet) {
        return res.status(400).json(responses.error(400, 'Unable to find user'));
      }
      return res.status(200).json(responses.success(200, 'Balance retrieved successfully', {
        isActivated: wallet.isActivated
      }));
    } catch (error) {
      return res.status(400).json(responses.error(400, 'Unable to retrieve walle'));
    }
  }
}

module.export = WalletController;
