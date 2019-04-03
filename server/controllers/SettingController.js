import User from '../models/User';
import Wallet from '../models/Wallet';
import responses from '../utils/responses';
import traceLogger from '../logger/tracelogger';

/**
 * @description Defines the actions to for the wallet endpoints
 * @class SettingController
 */
class SettingController {
  /**
   *@description Creates a new wallet for a new user
   *@static
   *@param  {Object} req - request
   *@param  {Object} res - request
   *@returns {object} - null
   *@memberof SettingController
   */
  static async addBankData(req, res) {
    try {
      const {
        phoneNumber,
        bankName,
        accountNumber
      } = req.body;
      const retrievedUser = await SettingController.retrieveUser(res, phoneNumber);
      if (!retrievedUser.phoneNumber) return;

      const {
        banks
      } = retrievedUser;

      const accountExist = banks && banks.find(bank => bank.accountNumber === accountNumber);
      if (accountExist) {
        return res.status(400).json(
          responses.error(400, 'Account already added, cannot be done twice')
        );
      }
      const updatedProfile = await User.findOneAndUpdate({
        phoneNumber
      }, {
        $addToSet: {
          banks: {
            bankName,
            accountNumber
          }
        }
      }, {
        new: true
      });

      const handledQueue = SettingController.handleQueue(updatedProfile);
      if (handledQueue) {
        return res.status(200).json(
          responses.success(200, 'Bank data successfully added', updatedProfile.banks)
        );
      }
    } catch (error) {
      traceLogger(error);
      return res.status(500).json(
        responses.error(500, 'Server error, failed to add bank details')
      );
    }
  }

  /**
   *@description Creates a new wallet for a new user
   *@static
   *@param  {Object} req - request
   *@param  {Object} res - request
   *@returns {object} - null
   *@memberof SettingController
   */
  static async removeBankData(req, res) {
    try {
      const {
        phoneNumber,
        accountNumber
      } = req.body;
      const retrievedUser = await SettingController.retrieveUser(res, phoneNumber);
      if (!retrievedUser.phoneNumber) return;
      if (!retrievedUser.banks.length) {
        return res.status(404).json(
          responses.error(404, 'No bank details added yet')
        );
      }
      const {
        banks
      } = retrievedUser;
      const accountExist = banks && banks.find(bank => bank.accountNumber === accountNumber);
      if (!accountExist) {
        return res.status(404).json(
          responses.error(404, 'This bank does not exist on your account')
        );
      }
      const updatedProfile = await User.findOneAndUpdate({
        phoneNumber
      }, {
        $pull: {
          banks: {
            accountNumber
          }
        }
      }, {
        new: true
      });
      return res.status(200).json(
        responses.success(200, 'Bank data successfully removed', updatedProfile.banks)
      );
    } catch (error) {
      traceLogger(error);
      return res.status(500).json(
        responses.error(500, 'Server error, failed to remove bank details')
      );
    }
  }

  /**
   *@description Creates a new wallet for a new user
   *@static
   *@param  {Object} res - request
   *@param  {Object} phoneNumber - phoneNumber
   *@returns {object} - null
   *@memberof SettingController
   */
  static async retrieveWallet(res, phoneNumber) {
    const retrievedWallet = await Wallet.findOne({
      phoneNumber
    });
    if (!retrievedWallet) return res.status(404).json(responses.error(404, 'Sorry this wallet does not exist'));
    if (!retrievedWallet.isActivated) {
      return res.status(401).json(responses.error(401, 'You need to activate your wallet'));
    }
    return retrievedWallet;
  }


  /**
   *@description Creates a new wallet for a new user
   *@static
   *@param  {Object} res - request
   *@param  {Object} phoneNumber - phoneNumber
   *@returns {object} - null
   *@memberof SettingController
   */
  static async retrieveUser(res, phoneNumber) {
    const retrievedUser = await User.findOne({
      phoneNumber
    });
    if (!retrievedUser) {
      return res.status(401).json(responses.error(401, 'You need to verify your account first'));
    }
    return retrievedUser;
  }
}

export default SettingController;
