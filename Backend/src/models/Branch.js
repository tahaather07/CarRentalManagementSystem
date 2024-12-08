const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  coordinates: {
    latitude: Number,
    longitude: Number
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Branch', branchSchema);