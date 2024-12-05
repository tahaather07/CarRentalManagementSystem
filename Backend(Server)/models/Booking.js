const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  pickupBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  returnBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentIntent: {
    stripePaymentIntentId: String,
    paypalOrderId: String,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'requires_payment_method', 'requires_confirmation', 'processing', 'succeeded', 'canceled'],
      default: 'pending'
    },
    createdAt: Date
  }
}, { timestamps: true }); 