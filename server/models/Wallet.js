const mongoose =  require('mongoose');

const {
  Schema
} = mongoose;

const walletSchema = new Schema({
  phoneNumber: {
    type: Number,
    unique: true,
    required: true
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  passCode: {
    type: String
  },
  totalAmount: {
    type: Number,
    default: 0.00
  },
  securityQuestion: {
    type: String,
  },
  securityAnswer: {
    type: String
  },
  date: {
    type: Date,
    default: new Date().toString()
  },
});

const Wallet = mongoose.model('wallet', walletSchema);

module.exports = Wallet;
