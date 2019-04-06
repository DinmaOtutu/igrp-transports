const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const responses = require("../utils/responses");
const config = require("../config/index");
const WalletController = require("../controllers/WalletController");
const validateAgentInput = require("../middlewares/agentvalidation");
const validateVehicleInput = require("../middlewares/vehicleValidation");
const Wallet = require("../models/Wallet");
const { JWT_SECRET } = config;
/**
 * @description Defines the actions to for the users endpoints
 * @class UsersController
 */
class UsersController {
  /**
   *@description Creates app support
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async createSuperAgent() {
    try {
      const phoneNumber = config.SUPERAGENT;
      const password = bcrypt.hashSync("superagent", 10);
      const userObject = {
        phoneNumber: phoneNumber,
        password: password,
        role: "admin"
      };
      const mongoUser = await User.findOne({
        phoneNumber
      });
      if (mongoUser === null) {
        await User.create(userObject);
        await WalletController.newWallet(phoneNumber);
      }
    } catch (error) {
      return error;
    }
  }

  /**
   *@description Login super agent
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async loginSuperAgent(req, res) {
    try {
      const { phoneNumber, password } = req.body;
      const agentNumber = config.SUPERAGENT;
      const user = await User.findOne({
        phoneNumber
      });
      if (phoneNumber.trim() !== agentNumber) {
        return res
          .status(403)
          .json(responses.error(403, "Sorry, incorrect phone number"));
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(403)
          .json(responses.error(403, "sorry, incorrect password"));
      }
      if (user) {
        const payload = {
          id: user._id,
          phoneNumber: user.phoneNumber
        };
        const token = jwt.sign(payload, JWT_SECRET);
        return res.status(200).json(
          responses.success(200, "Welcome superagent", {
            user,
            token
          })
        );
      }
      return res.status(500).json(responses.error(500, "Sorry, server error"));
    } catch (error) {
      return error;
    }
  }

  /**
   *@description Update SuperAgent
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async updateSuperAgent(req, res) {
    const { oldNumber, newNumber, password, newPassword } = req.body;
    const phoneNumber = oldNumber;
    const user = await User.findOneAndUpdate(
      {
        phoneNumber
      },
      {
        $set: {
          phoneNumber: newNumber,
          password: newPassword
        }
      },
      {
        new: true
      }
    );
    if (!user) {
      return res
        .status(404)
        .json(
          responses.error(
            404,
            "Sorry, we have no superagent with such number or password"
          )
        );
    }
    if (user.phoneNumber !== oldNumber && user.password !== password) {
      return res
        .status(404)
        .json(
          responses.error(404, "Sorry, incorrect phone number or password")
        );
    }
    if (user) {
      return res
        .status(200)
        .json(
          responses.success(
            200,
            "super agent profile successfully updated",
            user
          )
        );
    }
    return res.status(500).json(responses.success(500, "sorry, server error"));
  }
  /**
   *@description Create Agent
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async createAgent(req, res) {
    try {
      const { error } = validateAgentInput(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const {
        phoneNumber,
        fullname,
        address,
        email,
        password,
        age,
        guarantorsFullName,
        guarantorsPhonenumber,
        guarantorsAddress,
        meansOfId,
        idNumber
      } = req.body;
      const agentNumber = await User.findOne({
        phoneNumber
      });
      if (agentNumber) {
        return res
          .status(400)
          .json(responses.error(400, "Sorry, phone number already taken"));
      }
      if (
        password.length === null ||
        password.length === "" ||
        password.length === undefined
      ) {
        return res
          .status(400)
          .json(responses.error(400, "password field cannot be empty"));
      }
      const userObject = {
        fullname,
        phoneNumber,
        address,
        email,
        password: bcrypt.hashSync(password, 10),
        age,
        guarantorsFullName,
        guarantorsPhonenumber,
        guarantorsAddress,
        meansOfId,
        idNumber,
        role: "user"
      };

      const createdAgent = await User.create(userObject);
      await WalletController.newWallet(phoneNumber);
      await Wallet.findOneAndUpdate(
        {
          phoneNumber
        },
        {
          $set: {
            isActivated: true
          }
        },
        {
          new: true
        }
      );
      if (createdAgent) {
        return res
          .status(201)
          .json(
            responses.success(201, "Agent successfully created", userObject)
          );
      }
      return res.status(500).json(responses.error(500, "Sorry, server error"));
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *@description update an agents detail
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async agentDeviceNumber(req, res) {
    const { phoneNumber, deviceId } = req.body;
    const agent = await User.findOneAndUpdate(
      {
        phoneNumber
      },
      {
        $set: {
          deviceId: deviceId
        }
      },
      {
        new: true
      }
    );
    if (!agent) {
      return res
        .status(400)
        .json(responses.error(400, "Sorry, this agent does not exist"));
    }
    if (agent) {
      return res
        .status(200)
        .json(responses.success(200, "Agent successfully updated", agent));
    }
    return res.status(500).json(responses.error(500, "Sorry, server error"));
  }
  /**
   *@description update an agents detail
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async updateAgent(req, res) {
    const {
      phoneNumber,
      fullname,
      address,
      email,
      age,
      guarantorsFullName,
      guarantorsPhonenumber,
      guarantorsAddress,
      meansOfId,
      idNumber
    } = req.body;
    const userToUpdate = await User.findOneAndUpdate(
      {
        phoneNumber
      },
      {
        $set: {
          fullname,
          address,
          email,
          age,
          guarantorsFullName,
          guarantorsPhonenumber,
          guarantorsAddress,
          meansOfId,
          idNumber
        }
      },
      {
        new: true
      }
    );
    if (!userToUpdate) {
      return res
        .status(404)
        .json(responses.error(404, "Sorry, this agent doesnt exist"));
    }
    if (userToUpdate) {
      return res
        .status(200)
        .json(
          responses.success(200, "Agent successfully updated", userToUpdate)
        );
    }
    return res
      .status(500)
      .json(responses.error(500, "Failed to update, server error"));
  }

  /**
   *@description delete an agent
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async deleteAgent(req, res) {
    const { phoneNumber } = req.params;
    const user = await User.findOneAndDelete({
      phoneNumber
    });
    if (!user) {
      return res
        .status(404)
        .json(responses.error(404, "Sorry, this agent does not exist"));
    }
    if (user) {
      return res
        .status(200)
        .json(responses.success(200, "Agent successfully deleted", user));
    }
    return res
      .status(500)
      .json(responses.error(500, "Failed to delete, server error"));
  }

  /**
   *@description deactivate an agent
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async deactivateAgent(req, res) {
    const { phoneNumber } = req.body;
    if (
      phoneNumber === "" ||
      phoneNumber === null ||
      phoneNumber === undefined
    ) {
      return res
        .status(400)
        .json(responses.error(404, "Sorry, this field is required"));
    }
    const user = await User.findOneAndUpdate(
      {
        phoneNumber
      },
      {
        $set: {
          deactivate: true
        }
      },
      {
        new: true
      }
    );
    if (!user) {
      return res
        .status(404)
        .json(responses.error(404, "Sorry, this agent does not exist"));
    }
    if (user) {
      return res
        .status(200)
        .json(responses.success(200, "Agent deactivated successfully", user));
    }
    return res
      .status(500)
      .json(responses.error(500, "Failed to delete, server error"));
  }

  /**
   *@description activate an agent
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async activateAgent(req, res) {
    const { phoneNumber } = req.body;
    const user = await User.findOneAndUpdate(
      {
        phoneNumber
      },
      {
        $set: {
          deactivate: false
        }
      },
      {
        new: true
      }
    );
    if (!user) {
      return res
        .status(404)
        .json(responses.error(404, "Sorry, this agent does not exist"));
    }
    if (user) {
      return res
        .status(200)
        .json(responses.success(200, "Agent deactivated successfully", user));
    }
    return res
      .status(500)
      .json(responses.error(500, "Failed to delete, server error"));
  }

  /**
   *@description login for agents
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async loginAgent(req, res) {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({
      phoneNumber
    });
    const wallet = await Wallet.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json(responses.error(404, "Sorry, this agent does not exist"));
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res
        .status(403)
        .json(responses.error(403, "sorry, incorrect password"));
    }
    if (user.deactivate === true) {
      return res
        .status(400)
        .json(responses.error(400, "Sorry, you have been deactivated contact"));
    }
    if (user) {
      const payload = {
        id: user._id,
        phoneNumber: user.phoneNumber
      };
      const token = jwt.sign(payload, JWT_SECRET);
      return res.status(200).json(
        responses.success(200, "Agent successfully logged in", {
          user,
          token,
          walletBalance: wallet.totalAmount
        })
      );
    }
    return res
      .status(500)
      .json(responses.error(500, "Failed to delete, server error"));
  }

  /**
   *@description create Vehicles
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async createVehicle(req, res) {
    try {
      const { error } = validateVehicleInput(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const {
        phoneNumber,
        vehicleType,
        vehicleNumber,
        driversLicence,
        plateNumber,
        vehicleOwnerName,
        vehicleOwnerAdress,
        RegistrationYear,
        chasisNo,
        engineNumber,
        vehicleMake,
        vrtID,
        RoadWorthinessExpDate,
        InsuranceExpDate,
        locationOfTransaction
      } = req.body;
      const vehicle = await User.findOne({
        plateNumber
      });
      if (vehicle) {
        return res
          .status(400)
          .json(
            responses.error(
              400,
              "Sorry, this Plate number is taken and the vehicle exist"
            )
          );
      }

      const vehicleTaxID = await User.findOne({ vrtID });

      if (vehicleTaxID) {
        return res
          .status(400)
          .json(
            responses.error(400, "Sorry, this Vehicle Tax ID already exists")
          );
      }
      const phoneNumb = await User.findOne({ phoneNumber });
      if (phoneNumb) {
        return res
          .status(400)
          .json(responses.error(400, "Sorry, this phone number is taken"));
      }

      const theVehicleNumber = await User.findOne({
        vehicleNumber
      });
      if (theVehicleNumber) {
        return res
          .status(400)
          .json(responses.error(400, "Sorry, this vehicle number is taken"));
      }

      if (!vehicle && !theVehicleNumber && !vehicleTaxID && !phoneNumb) {
        const vehicleObject = {
          phoneNumber,
          vehicleType,
          vehicleNumber,
          driversLicence,
          plateNumber,
          vehicleOwnerName,
          vehicleOwnerAdress,
          RegistrationYear,
          chasisNo,
          engineNumber,
          vehicleMake,
          vrtID,
          RoadWorthinessExpDate,
          InsuranceExpDate,
          locationOfTransaction,
          role: "driver"
        };
        const createVehicle = await User.create(vehicleObject);
        return res
          .status(200)
          .json(
            responses.success(
              200,
              "Vehicle created successfully",
              createVehicle
            )
          );
      }
      return res
        .status(500)
        .json(responses.error(500, "Failed to create a Vehicle"));
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   *@description get all agents
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async allAgents(req, res) {
    try {
      const agents = await User.find({
        role: "user"
      });
      if (agents.length === 0) {
        return res
          .status(404)
          .json(responses.error(404, "Sorry, no agents created yet!"));
      }
      if (agents) {
        return res
          .status(200)
          .json(responses.success(200, "Agents retrieved succssfully", agents));
      }

      return res.status(500).json(responses.error(500, "Sorry, server error!"));
    } catch (error) {
      return error;
    }
  }

  /**
   *@description get all Vehicles
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async allVehicle(req, res) {
    const vehicle = await User.find({
      role: "driver"
    });
    if (!vehicle.length) {
      return res
        .status(404)
        .json(responses.error(404, "Sorry, no vehicles created yet!"));
    }
    if (vehicle) {
      return res
        .status(200)
        .json(
          responses.success(200, "Successfully retrieved vehicles", vehicle)
        );
    }
    return res.status(500).json(responses.error(500, "Sorry, server error!"));
  }

  /**
   *@description get a single agent
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async singleAgent(req, res) {
    const { phoneNumber } = req.params;
    const agent = await User.findOne({
      phoneNumber
    });
    if (!agent) {
      return res
        .status(404)
        .json(responses.error(404, "Sorry, this agent does not exist!"));
    }
    if (agent) {
      return res
        .status(200)
        .json(responses.success(200, "Successfully retrieved agent", agent));
    }
    return res.status(500).json(responses.error(500, "Sorry, server error!"));
  }

  /**
   *@description get a single vehicle
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */
  static async singleVehicle(req, res) {
    const { vrtID } = req.params;
    const vTaxId = await User.findOne({
      vrtID
    });
    if (!vTaxId) {
      return res
        .status(404)
        .json(responses.error(404, "Sorry, this Vehicle does not exist!"));
    }
    if (vTaxId) {
      return res
        .status(200)
        .json(responses.success(200, "Successfully retrieved vehicle", vTaxId));
    }
    return res.status(500).json(responses.error(500, "Sorry, server error!"));
  }

 

  static async updateVehicle(req, res) {
    try {
      const {User_id}= req.params;
      const {
        phoneNumber,
        vehicleType,
        vehicleNumber,
        driversLicence,
        plateNumber,
        vehicleOwnerName,
        vehicleOwnerAdress,
        RegistrationYear,
        chasisNo,
        engineNumber,
        vehicleMake,
        vrtID,
        RoadWorthinessExpDate,
        InsuranceExpDate,
        locationOfTransaction
      } = req.body;
      const vehicleToUpdate = await User.findByIdAndUpdate(
        {
         
         _id: User_id
        },
        {
          $set: {
            phoneNumber,
            vehicleType,
            vehicleNumber,
            driversLicence,
            plateNumber,
            vehicleOwnerName,
            vehicleOwnerAdress,
            RegistrationYear,
            chasisNo,
            engineNumber,
            vehicleMake,
            vrtID,
            RoadWorthinessExpDate,
            InsuranceExpDate,
            locationOfTransaction
          }
        },
        {
          new: true
        }
      );

      if (!vehicleToUpdate) {
        return res
          .status(404)
          .json(responses.error(404, "This Vehicle Tax ID does not exist"));
      }
      if (vehicleToUpdate) {
        return res
          .status(200)
          .json(
            responses.success(
              200,
              "Vehicle successfully updated",
              vehicleToUpdate
            )
          );
      }
      return res
        .status(500)
        .json(responses.error(500, "Failed to update, server error"));
    } catch (error) {
      return error;
    }
  }


  /**
   *@description deletes a  vehicle
   *@static
   *@param  {Object} res - response
   *@returns {object} - null
   *@memberof UserController
   */

  static async deleteVehicle(req, res) {
    try {
      const { User_id } = req.params;

      const plateNum = await User.findByIdAndDelete({ _id: User_id });

    if (!plateNum) {
      return res
        .status(400)
        .json(responses.error(400, " The vehicle does not exist"));
    }

    if (plateNum) {
      return res
        .status(200)
        .json(responses.success(200, "Vehicle successfully deleted", plateNum));
    }
    return res
      .status(500)
      .json(responses.error(500, "Failed to delete, server error"));

    } catch (error) {
      return error;
    }
  }

}

module.exports = UsersController;
