/* eslint-disable require-jsdoc */
const Joi = require("joi");

function validateAgentInput(user) {
  const schema = {
    errors: Joi.object(),
    isLoading: Joi.boolean(),
    phoneNumber: Joi.string().min(10),
    password: Joi.string()
      .min(6)
      .max(30),
    fullname: Joi.string()
      .min(6)
      .max(30),
    address: Joi.string().min(6),
    email: Joi.string(),
    age: Joi.number(),
    guarantorsFullName: Joi.string(),
    guarantorsPhonenumber: Joi.number().min(10),
    guarantorsAddress: Joi.string(),
    meansOfId: Joi.string(),
    idNumber: Joi.string().min(4)
  };

  return Joi.validate(user, schema);
}

module.exports = validateAgentInput;
