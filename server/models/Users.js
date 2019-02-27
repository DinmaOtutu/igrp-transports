const mongoose = require('mongoose');

const {
    Schema
} = mongoose;
const userSchema = new Schema({
    phoneNumber: {
        type: Number,
        unique: true,
        required: true,
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'driver']
    },
    fullname: {
        type: String
    },
    address: {
        type: String
    },
    bvn: {
        type: Number,
        unique: true,
        description: "BVN is unique and has already been used by another agent"
    },
    nimc: {
        type: String,
        unique: true,
        description: "NIMC is unique, an agent has already registered with this"
    },
    email: {
        type: String,
        unique: true,
        description: "Email has already been used by another agent"
    },
    age: {
        type: Number
    },
    driversLicense: {
        type: String,
        unique: true,
        description: "the driver license has already been used"
    },
    deviceId: {
        type: String
    },
    deactivate: {
        type: Boolean,
        default: false
    },

    vehicleNumber: {
        type: Number,
        sparse: true,
        unique: true,
        description: "this vehicle number has been assigned to an agent already"
    },

    date: {
        type: Date,
        default: new Date().toString()
    },
    plateNumber: {
        type: String,
    },
    vehicleType: {
        type: String,
         enum: ["tipper",
"taxi", "keke", "okada"],
description: "vehicle type can either be tipper, taxi, keke or okada"
}
});

const User = mongoose.model('user', userSchema);

module.exports = User;