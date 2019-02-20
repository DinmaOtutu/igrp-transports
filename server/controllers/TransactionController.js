const Transaction = require('../models/Transaction');
const responses = require('../utils/responses');
const User = require('../models/Users.js');


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
        const {
            phoneNumber,
            vehicleNumber,
            tipperPrice
        } = req.body;
        const agent = await User.findOne({
            phoneNumber
        });
        const validCarNumber = await User.findOne({
            vehicleNumber
        });
        if (!agent) {
            return res.status(404).json(
                responses.error(404, 'sorry this agent does not exist')
            );
        }
        if (!validCarNumber) {
            return res.status(404).json(
                responses.error(404, 'sorry this driver not exist')
            );
        }
        if (agent && validCarNumber) {
            const {
                fullname,
                phoneNumber
            } = agent;
            const transactionDetails = {
                vehicleNumber,
                tipperPrice,
                agentName: fullname,
                agentNumber: phoneNumber,
                date: agent.date,
                driverName: validCarNumber.fullname,
                driverNumber: validCarNumber.phoneNumber
            };
            const createdTransaction = await Transaction.create(transactionDetails);

            if (createdTransaction) {
                return res.status(201).json(
                    responses.success(201, 'Successfully created a transaction', transactionDetails)
                );
            }
            return res.status(400).json(
                responses.error(400, 'failed to create transaction')
            );
        }
        return res.status(500).json(
            responses.error(500, 'sorry, server error')
        );
    }
    /**
     *@description gets transactions
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof TransactionController
     */
    static async getTransactions(req, res) {
        const allTransactions = await Transaction.find({});
        if (!allTransactions) {
            return res.status(404).json(
                responses.error(404, 'Sorry, no transactions created yet!')
            );
        }
        if (allTransactions) {
            const returnedTransactions = allTransactions.map((transaction) => ({
                id: transaction.id,
                date: transaction.date,
                agentName: transaction.fullname,
                vehicleNumber: transaction.vehicleNumber,
                agentNumber: transaction.phoneNumber
            }));
            return res.status(200).json(
                responses.success(200, 'All retrieved succssfully', returnedTransactions)
            );
        }
        return res.status(500).json(
            responses.error(500, 'sorry, server error')
        );
    }

    /**
     *@description get transactions done by an AGENT
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof TransactionController
     */
    static async getAgentTransaction(req, res) {
        const {
            agentNumber
        } = req.params;
        const agent = await Transaction.find({
            agentNumber
        });
        if (!agent) {
            return res.status(404).json(
                responses.error(404, 'sorry, this agent does not exist')
            );
        }

        if (!agent.length) {
            return res.status(404).json(
                responses.error(404, 'sorry! no transactions carried out by this agent yet')
            );
        }
        if (agent) {
            const retrivedAgent = agent.map((transactions) => ({
                vehicleNumber: transactions.vehicleNumber,
                tipperPrice: transactions.tipperPrice,
                date: transactions.date,
                agentName: transactions.agentName,
                agentNumber: transactions.agentNumber
            }));
            return res.status(200).json(
                responses.success(200, 'All retrieved succssfully', retrivedAgent)
            );
        }
        return res.status(500).json(
            responses.error(500, 'sorry, server error')
        );
    }

    /**
     *@description get trips done by a driver
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof TransactionController
     */
    static async getDriverTrips(req, res) {
        const {
            driverNumber
        } = req.params;
        const findDriver = await Transaction.find({
            driverNumber
        });
        if (!findDriver) {
            return res.status(404).json(
                responses.error(404, 'sorry, this driver has no trips yet')
            );
        }
        if (findDriver) {
            const driverObject = findDriver.map((singleDriver) => ({
                driverNumber: singleDriver.driverNumber,
                driverName: singleDriver.drivername,
                vehicleNumber: singleDriver.vehicleNumber,
                date: singleDriver.date,
                tipperPrice: singleDriver.tipperPrice,
            }));
            return res.status(200).json(
                responses.success(200, 'All retrieved succssfully', driverObject)
            );
        }
        return res.status(500).json(
            responses.error(500, 'sorry, server error')
        );
    }
}

module.exports = TransactionController;