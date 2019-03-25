const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema({
  phoneNumber: {
    type: Number,
    unique: true,
    required: true,
    min: 10,
    description: "phone number must be 10 digits"
  },
  password: {
    type: String
    // required: true
  },

  role: {
    type: String,
    enum: ["admin", "user", "driver"]
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
    description: "BVN is unique and has been registered"
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    description: "Email has already been used by another agent"
  },
  age: {
    type: Number
  },
  guarantorsFullName: {
    type: String
  },
  guarantorsPhonenumber: {
    type: Number
  },
  guarantorsAddress: {
    type: String
  },
  meansOfId: {
    type: String,
    enum: ['voters card','international passport','national id card','drivers license']
  },
  idNumber: {
    type: String
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
    vehicleOwnerName: {
        type: String

    },
  vehicleOwnerAdress: {
    type: String
  },

  RegistrationYear: {
    type: String
  },
  chasisNo: {
    type: String,
    unique: true
  },
  engineNumber: {
    type: String,
    unique: true
  },
  vehicleMake: {
    type: String
  },
  vrtID: {
    type: Number,
    unique: true,
    description: "This vehicle road tax ID has already been taken by another driver"
  },
  RoadWorthinessExpDate: {
    type: String
  },
  InsuranceExpDate: {
    type: String
  },

  locationOfTransaction: {
    type: String
  },

  vehicleNumber: {
    type: Number,
    sparse: true,
    unique: true,
    description: "this vehicle number has been assigned to an driver already"
  },

  date: {
    type: Date,
    default: new Date().toString()
  },
  plateNumber: {
    type: String,
    description: "this plateNumber has been used by another driver"
  },
  vehicleType: {
    type: String,
    enum: ["tipper", "taxi", "keke", "okada"],
    description: "vehicle type can either be tipper, taxi, keke or okada"
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
