const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'cash'],
    required: true
  },
  stripePaymentIntentId: String,
  stripeCustomerId: String,
  paypalOrderId: String,
  paypalPayerId: String,
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'disputed'],
    default: 'pending'
  },
  paymentDetails: {
    last4: String,
    brand: String,
    email: String
  },
  metadata: {
    type: Map,
    of: String
  },
  refundDetails: [{
    amount: Number,
    reason: String,
    refundId: String,
    status: String,
    createdAt: Date
  }],
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

paymentSchema.index({ 'stripePaymentIntentId': 1 });
paymentSchema.index({ 'paypalOrderId': 1 });
paymentSchema.index({ 'booking': 1 }); 