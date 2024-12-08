const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailService = {
  sendPaymentConfirmation: async (booking, payment, customerEmail) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: 'Payment Confirmation - Car Rental',
        text: `Your payment for booking #${booking._id} has been verified. Amount paid: $${payment.amount}`
      };

      await transporter.sendMail(mailOptions);
      console.log('Payment confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
      throw error;
    }
  }
};

module.exports = emailService; 