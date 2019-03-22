const Joi = require("joi");



function validateVehicleInput(user) {
    const schema = {
        errors: Joi.object(),
        isLoading: Joi.boolean(),
        phoneNumber: Joi.string()
            .required()
            .min(10),

        vehicleType: Joi.string()
            .required()
            .min(1),
        vehicleNumber: Joi.number()
            .required()
            .min(2),
        driversLicence: Joi.string()
            .required()
            .min(4),
        vehicleOwnerName: Joi.string()
            .required()
            .min(4),
        vehicleOwnerAdress: Joi.string()
            .required()
            .min(4),
        RegistrationYear: Joi.string().required(),
        chasisNo: Joi.string()
            .required()
            .min(4),
        engineNumber: Joi.string()
            .required()
            .min(4),
        vehicleMake: Joi.string().required(),
        vrtID: Joi.string()
            .required()
            .min(2),
        RoadWorthinessExpDate: Joi.string()
            .required()
            .min(3),
        InsuranceExpDate: Joi.string()
            .required()
            .min(3),
        locationOfTransaction: Joi.string()
            .required()
            .min(3),
        plateNumber: Joi.string()
            .required()
            .min(3)
    };

    return Joi.validate(user, schema);
}

module.exports = validateVehicleInput;
