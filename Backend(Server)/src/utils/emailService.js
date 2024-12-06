const nodemailer = require('nodemailer');
const { paymentConfirmationTemplate } = require('./emailTemplates');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
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
        html: paymentConfirmationTemplate(booking, payment)
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