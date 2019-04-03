const bcrypt = require ('bcrypt');

/**
 * @description Defines helper method on the system
 * @class Helper
 */
class DataProtector {
  /**
   *@description verifies a token
   *@static
   *@param  {object} value - data to hash
   *@returns {object} - status code, message and updated user's details
   *@memberof DataProtector
   */
  static hashData(value) {
    return bcrypt.hashSync(value && value.toString(), 10);
  }

  /**
   *@description verifies a token
   *@static
   *@param  {object} newData - data to compare
   *@param  {object} previousHash - data to compare
   *@returns {object} - status code, message and updated user's details
   *@memberof DataProtector
   */
  static compareData(newData, previousHash) {
    return bcrypt.compareSync((newData.toString()), previousHash);
  }
}

module.exports =  DataProtector;
