const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['pre-rental', 'post-rental'],
    required: true
  },
  condition: {
    exterior: String,
    interior: String,
    mileage: Number,
    fuelLevel: Number,
    damages: [String]
  },
  notes: String,
  images: [String]
}, { timestamps: true }); 

module.exports = mongoose.model('Inspection', inspectionSchema);