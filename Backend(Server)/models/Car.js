const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  licensePlate: { type: String, required: true, unique: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  dailyRate: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'rented', 'maintenance'],
    default: 'available'
  },
  features: [String],
  images: [String],
  mileage: Number,
  transmission: { 
    type: String,
    enum: ['automatic', 'manual'],
    required: true
  }
}, { timestamps: true }); 