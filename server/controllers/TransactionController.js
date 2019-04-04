const Transaction = require("../models/Transaction");
const responses = require("../utils/responses");
const crypto = require('crypto');
const dotenv = require('dotenv');
const User = require("../models/Users.js");
const axios = require('axios');
const config = require('../config/index')
const Wallet = require('../models/Wallet');

/**
 * @description Defines the actions to for the users endpoints
 * @class UsersController
 */
class TransactionController {
  /**
   *@description Creates transaction for tipper drivers
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof TransactionController
   */
  static async createTransaction(req, res) {
    try {
      const randomNumber = (min, max) =>
        Math.floor(Math.random() * (max - min) + min);
      const transID = randomNumber(1000, 99999999);

      req.body.transID = `${Date.now()}-${transID}`;

      const { phoneNumber, vrtID, tipperPrice } = req.body;
      const agent = await User.findOne({
        phoneNumber, vrtID
      });
      if (!agent) {
        return res
          .status(404)
          .json(responses.error(404, "sorry this agent does not exist"));
      }
      if (!validCarNumber) {
        return res
          .status(404)
          .json(responses.error(404, "sorry this vehicle not exist"));
      }
      if (agent && validCarNumber && transID) {
        const wallet = await Wallet.findOne({ phoneNumber })
        if (wallet.totalAmount <= 19.99) return res
          .status(400)
          .json(responses.error(400, "Insufficient balance"));

        const { fullname, phoneNumber } = agent;
        const transactionDetails = {
          transactionID: req.body.transID,
          vrtID,
          tipperPrice,
          agentName: fullname,
          agentNumber: phoneNumber,
          date: agent.date,
          driverName: validCarNumber.fullname,
          driverNumber: validCarNumber.phoneNumber,
          vehicleNumber: validCarNumber.vehicleNumber
        };
        const createdTransaction = await Transaction.create(
          transactionDetails
        );

        if (createdTransaction) {
          const balance = Number(totalAmount) - Number(20)
          const debitedWallet = await Wallet.findOneAndUpdate(
            {
              phoneNumber
            },
            {
              $set: {
                totalAmount: balance
              }
            },
            {
              new: true
            }
          );
          return res
            .status(201)
            .json(
              responses.success(
                201,
                "Successfully created a transaction",
                { transactionDetails, debitedWallet: debitedWallet.totalAmount }
              )
            );
        }
        return res
          .status(400)
          .json(responses.error(400, "failed to create transaction"));
      }
    } catch (error) {
      return res.status(500).json(responses.error(500, "sorry, server error"));
    }
  }

  /**
   *@description gets transactions
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof TransactionController
   */
  static async getTransactions(req, res) {
    try {
      const allTransactions = await Transaction.find({});

      if (!allTransactions.length) {
        return res
          .status(404)
          .json(responses.error(404, "Sorry, no transactions created yet!"));
      }
      if (allTransactions) {
        const returnedTransactions = allTransactions.map(
          transaction => ({
            id: transaction.id,
            date: transaction.date,
            tipperprice: transaction.tipperPrice,
            agentName: transaction.agentName,
            vehicleNumber: transaction.vehicleNumber,
            agentNumber: transaction.agentNumber,
            vrtID: transaction.vrtID
          })
        );
        return res
          .status(200)
          .json(
            responses.success(
              200,
              "Transactions retrieved successfully",
              returnedTransactions
            )
          );
      }
      return res.status(500).json(responses.error(500, "sorry, server error"));
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *@description get transactions done by an AGENT
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof TransactionController
   */
  static async getAgentTransaction(req, res) {
    const { agentNumber } = req.params;
    const agent = await Transaction.find({
      agentNumber
    });

    if (!agent.length) {
      return res
        .status(404)
        .json(
          responses.error(
            404,
            "sorry, no transactions carried out yet by this  agent"
          )
        );
    }



    if (agent) {
      const retrivedAgent = agent.map(transactions => ({
        vehicleNumber: transactions.vehicleNumber,
        tipperPrice: transactions.tipperPrice,
        date: transactions.date,
        agentName: transactions.agentName,
        agentNumber: transactions.agentNumber,
        vrtID: transactions.vrtID
      }));
      return res
        .status(200)
        .json(
          responses.success(200, "All retrieved succssfully", retrivedAgent)
        );
    }
    return res.status(500).json(responses.error(500, "sorry, server error"));
  }

  /**
   *@description get trips done by a driver
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof TransactionController
   */
  static async getVehicleTrips(req, res) {
    const { vrtID } = req.params;
    const findVehicle = await Transaction.find({
      vrtID
    });
    if (!findVehicle.length) {
      return res
        .status(404)
        .json(responses.error(404, "sorry, this Vehicle has no trips yet"));
    }
    if (findVehicle) {
      const driverObject = findVehicle.map(singleVehicle => ({
        driverName: singleVehicle.drivername,
        vehicleNumber: singleVehicle.vehicleNumber,
        date: singleVehicle.date,
        tipperPrice: singleVehicle.tipperPrice,
        vrtID: singleVehicle.vrtID
      }));
      return res
        .status(200)
        .json(
          responses.success(200, "All retrieved succssfully", driverObject)
        );
    }
    return res.status(500).json(responses.error(500, "sorry, server error"));
  }


}

module.exports = TransactionController;
