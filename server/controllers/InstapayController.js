/* eslint-disable camelcase */
/* eslint-disable max-len */
const axios = require('axios');
const jwt = require('jsonwebtoken');
const Wallet = require('../models/Wallet');
const responses = require('../utils/responses');
const config = require('../config/index');
const TransactionHistory = require('../models/TransactionHistory');

const { INNSTAPAY_SECRET_KEY_TEST, BANK_URL } = config;

/**
 * @description Defines the actions to for the wallet endpoints
 * @class WalletController
 */
class InstapayController {
  /**
     *@description get banks
      *@static
      *@param  {Object} req - request
      *@param  {object} res - response
      *@returns {object} - status code, message and created wallet
      *@memberof InstapayController
      */
  static async getBankList(req, res) {
    try {
      const banks = (await axios.get(`${BANK_URL}/banks`, {
        headers: {
          Authorization: `Bearer ${INNSTAPAY_SECRET_KEY_TEST}`
        }
      })).data;
      return res.status(200).json(
        responses.success(200, 'success', banks)
      );
    } catch (error) {
      return res.status(500).json(responses.error(500, 'Server error, attempt failed please try again'));
    }
  }

  /**
   *@description wallet to bank transfer
    *@static
    *@param  {Object} req - request
    *@param  {object} res - response
    *@returns {object} - status code, message and created wallet
    *@memberof InstapayController
    */
  static async creditWallet(req, res) {
    try {
      const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
      const ref = randomNumber(1000, 9999);

      const {
        amount,
        customer: {
          email,
          firstName,
          lastName,
          phone
        }, callbackUrl
      } = req.body;
      req.body.ref = `${Date.now()}-${ref}`;

      if (!req.body) return res.status(400).json(responses.error(400, 'Please fill in all fields'));
      if (amount < 50) return res.status(400).json(responses.error(400, 'Minimum amount you can fund is N50'));
      const jwttoken = req.headers.authorization || req.headers['x-access-token'];
      const decoded = jwt.decode(jwttoken);

      const {
        phoneNumber
      } = decoded;
      const retrivedWallet = await Wallet.findOne({ phoneNumber });
      if (!retrivedWallet) return res.status(404).json(responses.error(404, 'invalid account'));
      const data = {
        amount,
        customer: {
          email,
          firstName,
          lastName,
          phone
        },
        callbackUrl,
        reference: req.body.ref
      };
      const transferResponse = (await axios.post(`${BANK_URL}/transactions`, data, {
        headers: {
          Authorization: `Bearer ${INNSTAPAY_SECRET_KEY_TEST}`
        }
      })).data;
      return res.status(200).json(
        responses.success(200, 'success', transferResponse)
      );
    } catch (error) {
      return res.status(500).json(responses.error(500, 'Server error, attempt failed please try again'));
    }
  }

  /**
   *@description wallet to bank transfer
    *@static
    *@param  {Object} req - request
    *@param  {object} res - response
    *@returns {object} - status code, message and created wallet
    *@memberof InstapayController
    */
  static async bankTransfer(req, res) {
    try {
      const {
        accountNo, bankCode, amount, phoneNumber
      } = req.body;
      if (!bankCode || !accountNo
        || !amount
      ) return res.status(400).json(responses.error(400, 'Please fill in all fields'));
      if (amount < 50) return res.status(400).json(responses.error(400, 'Minimum amount you can withdraw is N50'));
      
      const retrivedWallet = await Wallet.findOne({ phoneNumber });
      if (!retrivedWallet) return res.status(404).json(responses.error(404, 'this account does not exist'));
      if (retrivedWallet && retrivedWallet.totalAmount < amount) return res.status(400).json(responses.error(400, 'Insufficient amount, please fund your account'));
      const data = {
        accountNo,
        bankCode,
        amount
      };
      const transfer = (await axios.post(`${BANK_URL}/transfers/bank`, data, {
        headers: {
          Authorization: `Bearer ${INNSTAPAY_SECRET_KEY_TEST}`
        }
      })).data;
      try{
        let balance;
        const {
          totalAmount,
        } = retrivedWallet;
        // eslint-disable-next-line prefer-const
        balance = totalAmount - amount;
        await Wallet.findOneAndUpdate({
          phoneNumber: retrivedWallet.phoneNumber
        }, {
            totalAmount: balance
          }, {
            new: true
          });
          await TransactionHistory.create({
            phoneNumber, amount, transactionType: 'withdrawal', status: 'pending', merchantReference: transfer.data.transactionReference
          })
      } catch(error){
        console.log(error)
      }
     
     
      const { message } = transfer;
      return res.status(200).json(
        responses.success(200, message, transfer)
      );
    } catch (error) {
      const { message } = error.response.data;
      res.status(500).json({
        message
      });
      return res.status(500).json(responses.error(500, 'Server error, attempt failed please try again'));
    }
  }

  /**
   *@description webhook response
    *@static
    *@param  {Object} req - request
    *@param  {object} res - response
    *@returns {object} - status code, message from webhook
    *@memberof InstapayController
    */
  static async webHook(req, res) {
    try {
      const phone = req.body.data.customer ? req.body.data.customer.phone : null;
      const firstName = req.body.data.customer ? req.body.data.customer.firstName : null;
      const lastName = req.body.data.customer ? req.body.data.customer.lastName : null;
      const { amount } = req.body.data;
      const reference = req.body.data.transactionReference;
      const { notification_type } = req.body;
      const { status } = req.body.data;
      const newSenderTransaction = {
        phoneNumber: phone,
        amount,
        firstName,
        lastName,
        status,
        merchantReference: [reference],
        notification_type
      };

      await InstapayController.updateBalanceAndHistoryCredit(
        res, newSenderTransaction, phone, amount, notification_type, reference, status,
      );
      await InstapayController.updateBalanceAndHistoryDebit(
        res, newSenderTransaction, phone, amount, notification_type, reference, status,
      );
      return res.status(200).send('ok');
    } catch (error) {
      console.log(error)
      return res.status(500).json(responses.error(500, 'Server error, attempt failed please try again'));
    }
  }

  /**
   *@description Updates a user's balance and creates transaction history
   *@static
   *@param  {Object} res - response
   *@param  {Object} newSenderTransaction - sender's object
   *@param  {Object} phone - phonenumber
   *@param  {Object} amount - transaction amount
   *@param  {Object} type - transaction type
   *@param  {Object} reference - transaction reference
   *@param  {Object} status - transaction status
   *@returns {object} - null
   *@memberof walletController
   */
  static async updateBalanceAndHistoryDebit(
    res, newSenderTransaction, phone, amount, notification_type, reference, status,
  ) {
   
    if (!phone) {
      const transactionHistory = await TransactionHistory.find({ merchantReference: reference });
      newSenderTransaction.phone = transactionHistory[0].phoneNumber;
    }
    let balance;
    if (status !== 'successful' && notification_type === 'transfer') {
      const retrievedWallet = await Wallet.findOne({ phoneNumber: transactionHistory[0].phoneNumber });
      const {
        totalAmount,
      } = retrievedWallet;
      // eslint-disable-next-line prefer-const
      balance = totalAmount + amount;
      await Wallet.findOneAndUpdate({
        phoneNumber: transactionHistory[0].phoneNumber
      }, {
          totalAmount: balance
        }, {
          new: true
        });
    }
  }

  /**
   *@description Updates a user's balance and creates transaction history
   *@static
   *@param  {Object} res - response
   *@param  {Object} newSenderTransaction - sender's object
   *@param  {Object} phone - phonenumber
   *@param  {Object} amount - transaction amount
   *@param  {Object} type - transaction type
   *@param  {Object} reference - transaction reference
   *@param  {Object} status - transaction status
   *@returns {object} - null
   *@memberof walletController
   */
  static async updateBalanceAndHistoryCredit(
    res, newSenderTransaction, phone, amount, notification_type, reference, status,
  ) {
    let balance;
    if (status === 'successful' && notification_type === 'transaction') {
      await TransactionHistory.create(newSenderTransaction);
      const retrievedWallet = await Wallet.findOne({ phoneNumber: phone });
      const checkReference = await TransactionHistory.find({merchantReference: reference})
      if (!checkReference) {
        const {
          totalAmount,
        } = retrievedWallet;
        // eslint-disable-next-line prefer-const
        balance = totalAmount + amount;
        await Wallet.findOneAndUpdate({
          phoneNumber: retrievedWallet.phoneNumber
        }, {
            totalAmount: balance
          }, {
            new: true
          });
      }
   
    }
  }
}

module.exports = InstapayController;
