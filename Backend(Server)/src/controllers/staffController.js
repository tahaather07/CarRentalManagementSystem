const Booking = require('../models/Booking');
const Inspection = require('../models/Inspection');
const Payment = require('../models/Payment');
const User = require('../models/User');
const emailService = require('../utils/emailService');

const staffController = {
  // Get bookings for staff's branch
  getBookings: async (req, res) => {
    try {
      // First, ensure the staff user's branch is populated
      const staffUser = await User.findById(req.user._id).populate('branch');
      
      const bookings = await Booking.find({
        $or: [
          { pickupBranch: staffUser.branch._id },
          { returnBranch: staffUser.branch._id }
        ]
      })
      .populate('customer', 'firstName lastName email phoneNumber')
      .populate('car', 'make model licensePlate')
      .populate('pickupBranch', 'name address')
      .populate('returnBranch', 'name address')
      .sort({ startDate: 1 });

      // Log for debugging
      console.log('Staff Branch:', staffUser.branch._id);
      console.log('Found Bookings:', bookings.length);

      res.json(bookings);
    } catch (error) {
      console.error('Error in getBookings:', error);
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
      const {
        booking,
        type,
        condition: {
          exterior,
          interior,
          mileage,
          fuelLevel,
          damages = []
        },
        notes,
        images = []
      } = req.body;

      // Validate required fields
      if (!booking || !type) {
        return res.status(400).json({ 
          error: 'Booking ID and inspection type are required' 
        });
      }

      // Verify the booking exists
      const bookingExists = await Booking.findById(booking);
      if (!bookingExists) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Create inspection with structured data
      const inspection = new Inspection({
        booking,
        type,
        inspector: req.user._id,
        condition: {
          exterior,
          interior,
          mileage,
          fuelLevel,
          damages
        },
        notes,
        images
      });

      await inspection.save();
      
      // Populate inspector details in response
      const populatedInspection = await Inspection.findById(inspection._id)
        .populate('inspector', 'firstName lastName')
        .populate('booking', 'startDate endDate');

      res.status(201).json(populatedInspection);
    } catch (error) {
      console.error('Error creating inspection:', error);
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
      
      // Get booking details first to access customer information
      const booking = await Booking.findById(bookingId)
        .populate('customer', 'email');
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const payment = new Payment({
        booking: bookingId,
        amount,
        paymentMethod,
        status: 'completed',
        paidBy: req.user._id
      });

      await payment.save();

      // Update booking payment status
      booking.paymentStatus = 'paid';
      await booking.save();

      // Send payment confirmation email
      try {
        await emailService.sendPaymentConfirmation(
          booking,
          payment,
          booking.customer.email
        );
      } catch (emailError) {
        console.error('Failed to send payment confirmation email:', emailError);
      
      }

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