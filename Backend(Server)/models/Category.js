const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  basePrice: { type: Number, required: true }
}, { timestamps: true }); 