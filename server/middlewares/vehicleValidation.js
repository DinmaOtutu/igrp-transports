const Joi = require("joi");

function validateVehicleInput(user) {
  const schema = {
    errors: Joi.object(),
    isLoading: Joi.boolean(),
    phoneNumber: Joi.string().min(10),
    vehicleType: Joi.string().min(1),
    vehicleNumber: Joi.number().min(2),
    driversLicence: Joi.string().min(4),
    vehicleOwnerName: Joi.string().min(4),
    vehicleOwnerAdress: Joi.string().min(4),
    RegistrationYear: Joi.string(),
    chasisNo: Joi.string().min(4),
    engineNumber: Joi.string().min(4),
    vehicleMake: Joi.string(),
    vrtID: Joi.string().min(2),
    RoadWorthinessExpDate: Joi.string().min(3),
    InsuranceExpDate: Joi.string().min(3),
    locationOfTransaction: Joi.string().min(3),
    plateNumber: Joi.string().min(3)
  };

  return Joi.validate(user, schema);
}

module.exports = validateVehicleInput;
