const jwt = require('jsonwebtoken');
const bcrypt =  require('bcrypt');
const User = require('../models/Users');
const responses = require('../utils/responses');
const config = require('../config/index');

const {
    JWT_SECRET
} = config
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
            const password = bcrypt.hashSync('superagent', 10);
            const userObject = {
                phoneNumber: phoneNumber,
                password: password,
                role: 'admin',
            };
            const mongoUser = await User.findOne({
                phoneNumber
            });
            if (mongoUser === null) {
                await User.create(userObject);
            }
        } catch (error) {
            return (error);
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
            const {
                phoneNumber,
                password
            } = req.body;
            const agentNumber = config.SUPERAGENT;
            const user = await User.findOne({
                phoneNumber
            });
            if (phoneNumber.trim() !== agentNumber) {
                return res.status(403).json(
                    responses.error(403, 'Sorry, incorrect phone number')
                );
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(403).json(
                    responses.error(403, 'sorry, incorrect password')
                );
            }
            if (user) {
                const payload = {
                    id: user._id,
                    phoneNumber: user.phoneNumber
                };
                const token = jwt.sign(payload, JWT_SECRET);
                return res.status(200).json(
                    responses.success(200, 'Welcome superagent', {
                        user,
                        token,
                    })
                );
            }
            return res.status(500).json(
                responses.error(500, 'Sorry, server error')
            );
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
        const {
            oldNumber,
            newNumber,
            password,
            newPassword
        } = req.body;
        const phoneNumber = oldNumber;
        const user = await User.findOneAndUpdate({
            phoneNumber
        }, {
            $set: {
                phoneNumber: newNumber,
                password: newPassword
            }
        }, {
            new: true
        });
        if (!user) {
            return res.status(404).json(
                responses.error(404, 'Sorry, we have no superagent with such number or password')
            );
        }
        if (user.phoneNumber !== oldNumber && user.password !== password) {
            return res.status(404).json(
                responses.error(404, 'Sorry, incorrect phone number or password')
            );
        }
        if (user) {
            return res.status(200).json(
                responses.success(200, 'super agent profile successfully updated', user)
            );
        }
        return res.status(500).json(
            responses.success(500, 'sorry, server error')
        );
    }
    /**
     *@description Create Agent
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof UserController
     */
    static async createAgent(req, res) {
        const {
            phoneNumber,
            fullname,
            address,
            bvn,
            nimc,
            email,
            password,
            age,
            driversLicence
        } = req.body;
        const agentNumber = await User.findOne({
            phoneNumber
        })
        if (agentNumber) {
            return res.status(400).json(
                responses.error(400, 'Sorry, phone number already taken')
            );
        }
        const userObject = {
            fullname,
            phoneNumber,
            address,
            bvn,
            nimc,
            email,
           password: bcrypt.hashSync(password, 10),
            age,
            driversLicence,
            role: 'user'
        }
        const createdAgent = await User.create(userObject);
        if (createdAgent) {
            return res.status(201).json(
                responses.success(201, 'Agent successfully created', userObject)
            );
        }
        return res.status(500).json(
            responses.error(500, 'Sorry, server error')
        );
    }


    /**
     *@description update an agents detail
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof UserController
     */
    static async agentDeviceNumber(req, res) {
        const {
            phoneNumber,
            deviceId
        } = req.body;
        const agent = await User.findOneAndUpdate({
            phoneNumber
        }, {
            $set: {
                deviceId: deviceId
            }
        }, {
            new: true
        });
        if (!agent) {
            return res.status(400).json(
                responses.error(400, 'Sorry, this agent does not exist')
            );
        }
        if (agent) {
            return res.status(200).json(
                responses.success(200, 'Agent successfully updated', agent)
            );
        }
        return res.status(500).json(
            responses.error(500, 'Sorry, server error')
        );
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
            bvn,
            nimc,
            email,
            password,
            age,
            driversLicence,
        } = req.body;
        const userToUpdate = await User.findOneAndUpdate({
            phoneNumber
        }, {
            $set: {
                fullname,
                address,
                bvn,
                nimc,
                email,
                password,
                age,
                driversLicence,

            }
        }, {
            new: true
        });
        if (!userToUpdate) {
            return res.status(404).json(
                responses.error(404, 'Sorry, this agent doesnt exist')
            );
        }
        if (userToUpdate) {
            return res.status(200).json(
                responses.success(200, 'Agent successfully updated', userToUpdate)
            );
        }
        return res.status(500).json(
            responses.error(500, 'Failed to update, server error')
        );
    }

    /**
     *@description delete an agent
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof UserController
     */
    static async deleteAgent(req, res) {
        const {
            phoneNumber
        } = req.body;
        const user = await User.findOneAndDelete({
            phoneNumber
        });
        if (!user) {
            return res.status(404).json(
                responses.error(404, 'Sorry, this agent does not exist')
            );
        }
        if (user) {
            return res.status(200).json(
                responses.success(200, 'Agent successfully deleted', user)
            );
        }
        return res.status(500).json(
            responses.error(500, 'Failed to delete, server error')
        );
    }

    /**
     *@description deactivate an agent
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof UserController
     */
    static async deactivateAgent(req, res) {
        const {
            phoneNumber
        } = req.body;
        if(phoneNumber === '' || phoneNumber === null || phoneNumber === undefined) {
            return res.status(400).json(
                responses.error(404, 'Sorry, this field is required')
            );
        }
        const user = await User.findOneAndUpdate({
            phoneNumber
        }, {
            $set: {
                deactivate: true
            }
        }, {
            new: true
        })
        if (!user) {
            return res.status(404).json(
                responses.error(404, 'Sorry, this agent does not exist')
            );
        }
        if (user) {
            return res.status(200).json(
                responses.success(200, 'Agent deactivated successfully', user)
            );
        }
        return res.status(500).json(
            responses.error(500, 'Failed to delete, server error')
        );
    }

    /**
     *@description activate an agent
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof UserController
     */
    static async activateAgent(req, res) {
        const {
            phoneNumber
        } = req.body;
        const user = await User.findOneAndUpdate({
            phoneNumber
        }, {
            $set: {
                deactivate: false
            }
        }, {
            new: true
        })
        if (!user) {
            return res.status(404).json(
                responses.error(404, 'Sorry, this agent does not exist')
            );
        }
        if (user) {
            return res.status(200).json(
                responses.success(200, 'Agent deactivated successfully', user)
            );
        }
        return res.status(500).json(
            responses.error(500, 'Failed to delete, server error')
        );
    }

    /**
     *@description login for agents
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof UserController
     */
    static async loginAgent(req, res) {
        const {
            phoneNumber,
            password
        } = req.body;
        const user = await User.findOne({
            phoneNumber
        });
        if (!user) {
            return res.status(404).json(
                responses.error(404, 'Sorry, this agent does not exist')
            );
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(403).json(
                responses.error(403, 'sorry, incorrect password')
            );
        }
        if(user.deactivate === true) {
            return res.status(400).json(
                responses.error(400, 'Sorry, you have been deactivated contact')
            );
        }
        if (user) {
            const payload = {
                id: user._id,
                phoneNumber: user.phoneNumber
            };
            const token = jwt.sign(payload, JWT_SECRET);
            return res.status(200).json(
                responses.success(200, 'Agent successfully logged in', {
                    user,
                    token
                })
            );
        }
        return res.status(500).json(
            responses.error(500, 'Failed to delete, server error')
        );
    }

    /**
     *@description create drivers
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof UserController
     */
    static async createDriver(req, res) {
        const {
            phoneNumber,
            vehicleType,
            vehicleNumber,
            fullname,
            driversLicence,
            plateNumber
        } = req.body;
        const driver = await User.findOne({
            phoneNumber
        });
        if (driver) {
            return res.status(400).json(
                responses.error(400, 'Sorry, this phone number is taken and the driver exist')
            );
        }
        const driverNumber = await User.findOne({
            vehicleNumber
        });
        if (driverNumber) {
            return res.status(400).json(
                responses.error(400, 'Sorry, this vehicle number is taken')
            );
        }
        if (!driver && !driverNumber) {
            const driverObject = {
                phoneNumber,
                vehicleType,
                vehicleNumber,
                fullname,
                driversLicence,
                plateNumber,
                role: 'driver'
            }
            const createDriver = await User.create(driverObject);
            return res.status(200).json(
                responses.success(200, 'Driver created successfully', createDriver)
            );
        }
        return res.status(500).json(
            responses.error(500, 'Failed to create a driver')
        );
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
                role: 'user'
            });
            if (!agents) {
                return res.status(404).json(
                    responses.error(404, 'Sorry, no agents created yet!')
                );
            }
            if (agents) {
                return res.status(200).json(
                    responses.success(200, 'Agents retrieved succssfully', agents)
                );
            }

            return res.status(500).json(
                responses.error(500, 'Sorry, server error!')
            );
        } catch (error) {
            return error
        }
    }

    /**
     *@description get all drivers
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof UserController
     */
    static async allDrivers(req, res) {
        const agents = await User.find({
            role: 'driver'
        });
        if (!agents.length) {
            return res.status(404).json(
                responses.error(404, 'Sorry, no drivers created yet!')
            );
        }
        if (agents) {
            return res.status(200).json(
                responses.success(200, 'Successfully retrieved drivers', agents)
            );
        }
        return res.status(500).json(
            responses.error(500, 'Sorry, server error!')
        );
    }

    /**
     *@description get a single agent
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof UserController
     */
    static async singleAgent(req, res) {
        const {
            phoneNumber
        } = req.params;
        const agent = await User.findOne({
            phoneNumber
        });
        if (!agent) {
            return res.status(404).json(
                responses.error(404, 'Sorry, this agent does not exist!')
            );
        }
        if (agent) {
            return res.status(200).json(
                responses.success(200, 'Successfully retrieved agent', agent)
            );
        }
        return res.status(500).json(
            responses.error(500, 'Sorry, server error!')
        );
    }

    /**
     *@description get a single driver
     *@static
     *@param  {Object} res - response
     *@returns {object} - null
     *@memberof UserController
     */
    static async singleDriver(req, res) {
        const {
            phoneNumber
        } = req.params;
        const agent = await User.findOne({
            phoneNumber
        });
        if (!agent) {
            return res.status(404).json(
                responses.error(404, 'Sorry, this driver does not exist!')
            );
        }
        if (agent) {
            return res.status(200).json(
                responses.success(200, 'Successfully retrieved driver', agent)
            );
        }
        return res.status(500).json(
            responses.error(500, 'Sorry, server error!')
        );
    }
}

module.exports = UsersController;