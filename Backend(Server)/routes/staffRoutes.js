const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const staffAuth = require('../middleware/staffAuth');

// Apply staff authentication middleware to all routes
router.use(staffAuth);

// Booking routes
router.get('/bookings', staffController.getBookings);
router.put('/bookings/:bookingId/status', staffController.updateBookingStatus);

// Inspection routes
router.post('/inspections', staffController.createInspection);
router.get('/inspections/:bookingId', staffController.getInspections);

// Payment routes
router.post('/payments', staffController.processPayment);
router.get('/payments/:bookingId', staffController.getPaymentDetails);

module.exports = router; 