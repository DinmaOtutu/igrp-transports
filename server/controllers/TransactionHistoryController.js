const jwt = require('jsonwebtoken');
const TransactionHistory = require('../models/TransactionHistory');
const User = require('../models/Users');
const responses = require('../utils/responses');


/**
 * @description Defines the actions to for the wallet endpoints
 * @class TransactionController
 */
class TransactionHistoryController {
  /**
   *@description Creates new transaction for senders and receivers
   *@static
   *@param  {Number} phoneNumber - phone number of user
   *@param  {Number} receiverNumber - receiver's phone number
   *@param  {Number} amount - amount sent by sender
   *@param  {String} description - sender's optional description
   *@returns {object} - created transaction for both senders and receivers
   *@memberof TransactionController
   */
  static async createTransaction({
    phoneNumber,
    receiverNumber,
    amount,
    status, beneficiary
  }) {
    try {
      const newSenderTransaction = {
        phoneNumber,
        recipientNumber: receiverNumber,
        senderNumber: phoneNumber,
        amount,
        status,
        beneficiary,
        transactionType: 'transfer',
      };
      const newReceiverTransaction = {
        phoneNumber: receiverNumber,
        recipientNumber: receiverNumber,
        senderNumber: phoneNumber,
        status,
        amount,
        beneficiary,
        transactionType: 'credit',
      };
      const senderTransaction = await TransactionHistory.create(newSenderTransaction);
      const receiverTransaction = await TransactionHistory.create(newReceiverTransaction);

      newSenderTransaction.date = senderTransaction.date;
      newSenderTransaction.id = `${senderTransaction._id}`;
      newReceiverTransaction.date = receiverTransaction.date;
      newReceiverTransaction.id = `${receiverTransaction._id}`;

      return {
        senderTransaction,
        receiverTransaction
      };
    } catch (error) {
        return res.status(500).json(responses.error(500, 'Server error, attempt failed please try again'));
    }
  }

  /**
   *@description Creates new transaction for senders and receivers
   *@static
   *@param  {Object} req - request
   *@param  {Object} res - respinse
   *@returns {object} - transaction history of a user
   *@memberof TransactionController
   */
  static async getTransactionHistory(req, res) {
    try {
      const jwttoken = req.headers.authorization || req.headers['x-access-token'];
      const decoded = jwt.decode(jwttoken);
      const {
        phoneNumber
      } = decoded;
      const transactionHistory = await TransactionHistory.find({
        phoneNumber
      });

      if (!transactionHistory.length) {
        return res.status(404).json(responses.error(404, 'No transaction has been made on this account'));
      }
      return res.status(200).json(responses.success(200, 'Transaction history retrieved successfully', transactionHistory));
    } catch (error) {
        return res.status(500).json(responses.error(500, 'Server error, attempt failed please try again'));
    }
  }
}

module.exports = TransactionHistoryController;
