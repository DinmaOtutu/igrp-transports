const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema({
  transactionID: {
    type: String
  },
  deviceId: {
    type: String
  },
  agentNumber: {
    type: Number
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
    type: Number
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
  },
  vrtID: {
    type: Number,
    unique: true,
    sparse: true,
    description:
      "This vehicle road tax ID has already been taken by another driver"
  },
  date: {
    type: Date,
    default: new Date().toString()
  },
  vehicleType: { type: String, enum: ["tipper", "taxi", "keke", "okada"] }
});

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;