const nodemailer = require('nodemailer');

// Create transporter with Gmail settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Test the configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('Transporter Error:', {
            name: error.name,
            message: error.message,
            code: error.code,
            command: error.command
        });
    } else {
        console.log('Transporter Success:', success);
    }
});

const emailService = {
    sendPaymentConfirmation: async (booking, payment, customerEmail) => {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: customerEmail,
                subject: 'Payment Confirmation - Car Rental',
                text: `Your payment for booking #${booking._id} has been verified. Amount paid: $${payment.amount}`
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('Payment confirmation email sent successfully');
            return result;
        } catch (error) {
            console.error('Error sending payment confirmation email:', error);
            throw error;
        }
    }
};                    

module.exports = emailService; 