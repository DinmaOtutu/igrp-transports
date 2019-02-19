const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema({
    deviceId: {
        type: String
    },
    agentNumber: {
        type: Number,
    },
    tipperPrice: {
        type: Number,
        enum: [250, 500, 1000]
    },
    date: {
        type: Date,
        default: new Date().toString()
    },
    vehicleNumber: {
        type: Number,
    },
    fullName: {
        type: String
    },
    agentName: {
        type: String
    },
    driverName: {
        type: String
    },
    driverNumber: {
        type: Number
    }
});

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;