/* eslint-disable camelcase */
/* eslint-disable max-len */
const axios = require('axios');
const jwt = require('jsonwebtoken');
const Wallet = require('../models/Wallet');
const responses = require('../utils/responses');
const config = require('../config/index');

const { INNSTAPAY_SECRET_KEY_TEST, BANK_URL } = config;

/**
 * @description crediting, debiting, get all banks
 * @class InstapayController
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
      return(error);
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
      return(error);
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
        accountNo, bankCode, amount
      } = req.body;

      if (!bankCode || !accountNo
        || !amount
      ) return res.status(400).json(responses.error(400, 'Please fill in all fields'));
      if (amount < 50) return res.status(400).json(responses.error(400, 'Minimum amount you can withdraw is N50'));
      const jwttoken = req.headers.authorization || req.headers['x-access-token'];
      const decoded = jwt.decode(jwttoken);

      const {
        phoneNumber
      } = decoded;
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
      const { message } = transfer;
      return res.status(200).json(
        responses.success(200, message, transfer)
      );
    } catch (error) {
      const { message } = error.response.data;
      res.status(500).json({
        message
      });
      return(error);
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
      const { notifcation_type } = req.body;
      const { status } = req.body.data;

      const type = req.body.notification_type;
      const newSenderTransaction = {
        phoneNumber: phone,
        amount,
        firstName,
        lastName,
        status,
        merchantReference: [reference]
      };
      if (status === 'successful' && notifcation_type === 'transaction') {
        await InstapayController.updateBalanceAndHistoryCredit(
          res, newSenderTransaction, phone, amount, type, reference, status
        );
        res.sendStatus(200);
      }
      if (status === 'successful' && notifcation_type === 'transfer') {
        await InstapayController.updateBalanceAndHistoryDebit(
          res, newSenderTransaction, phone, amount, type, reference, status
        );
        res.sendStatus(200);
      }
    } catch (error) {
      return error;
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
    res, phone, amount
  ) {
    let balance;
    const retrievedWallet = await Wallet.findOne({ phoneNumber: phone });
    const {
      totalAmount,
    } = retrievedWallet;
    // eslint-disable-next-line prefer-const
    balance = totalAmount - amount;
    await Wallet.findOneAndUpdate({
      phoneNumber: retrievedWallet.phoneNumber
    }, {
      totalAmount: balance
    }, {
      new: true
    });
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
    res, phone, amount
  ) {
    let balance;
    const retrievedWallet = await Wallet.findOne({ phoneNumber: phone });
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

module.exports = InstapayController;
