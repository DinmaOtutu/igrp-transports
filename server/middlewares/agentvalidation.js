/* eslint-disable require-jsdoc */
const Joi = require("joi");

function validateAgentInput(user) {
  const schema = {
    errors: Joi.object(),
    isLoading: Joi.boolean(),
    phoneNumber: Joi.string()
      .required()
      .min(10),
    password: Joi.string()
      .min(6)
      .max(30)
      .required(),
    fullname: Joi.string()
      .min(6)
      .max(30)
      .required(),
    address: Joi.string()
      .min(6)
      .required(),
    email: Joi.string().required(),
    age: Joi.number().required(),
    guarantorsFullName: Joi.string().required(),
    guarantorsPhonenumber: Joi.number()
      .required()
      .min(10),
    guarantorsAddress: Joi.string().required(),
    meansOfId: Joi.string().required(),
    idNumber: Joi.string()
      .required()
      .min(4)
  };

  return Joi.validate(user, schema);
}

module.exports = validateAgentInput;
