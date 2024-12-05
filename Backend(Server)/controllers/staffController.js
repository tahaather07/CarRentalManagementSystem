const Booking = require('../models/Booking');
const Inspection = require('../models/Inspection');
const Payment = require('../models/Payment');

const staffController = {
  // Get bookings for staff's branch
  getBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({
        $or: [
          { pickupBranch: req.user.branch },
          { returnBranch: req.user.branch }
        ]
      })
      .populate('customer', 'firstName lastName email phoneNumber')
      .populate('car', 'make model licensePlate')
      .sort({ startDate: 1 });

      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update booking status
  updateBookingStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await Booking.findById(req.params.bookingId);

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Verify staff belongs to relevant branch
      if (!booking.pickupBranch.equals(req.user.branch) && 
          !booking.returnBranch.equals(req.user.branch)) {
        return res.status(403).json({ error: 'Not authorized to update this booking' });
      }

      booking.status = status;
      await booking.save();

      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create inspection record
  createInspection: async (req, res) => {
    try {
      const inspection = new Inspection({
        ...req.body,
        inspector: req.user._id
      });
      await inspection.save();
      res.status(201).json(inspection);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get inspection records
  getInspections: async (req, res) => {
    try {
      const inspections = await Inspection.find({ booking: req.params.bookingId })
        .populate('inspector', 'firstName lastName');
      res.json(inspections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Process payment
  processPayment: async (req, res) => {
    try {
      const { bookingId, amount, paymentMethod } = req.body;
      
      const payment = new Payment({
        booking: bookingId,
        amount,
        paymentMethod,
        status: 'completed',
        paidBy: req.user._id
      });

      await payment.save();

      // Update booking payment status
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid'
      });

      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get payment details
  getPaymentDetails: async (req, res) => {
    try {
      const payment = await Payment.findOne({ booking: req.params.bookingId })
        .populate('paidBy', 'firstName lastName email');
      
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = staffController; 