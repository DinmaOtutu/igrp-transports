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
        type: Number
    },
    nimc: {
        type: String
    },
    email: {
        type: String
    },
    age: {
        type: Number
    },
    driversLicense: {
        type: String
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
        sparse: true
    },

    date: {
        type: Date,
        default: new Date().toString()
    },
    plateNumber: {
        type: String,
    },
    vehicleType: {type: String, enum: ["tipper",
"taxi", "keke", "okada"]}
});

const User = mongoose.model('user', userSchema);

module.exports = User;