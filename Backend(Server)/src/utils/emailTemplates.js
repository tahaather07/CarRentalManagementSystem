const paymentConfirmationTemplate = (booking, payment) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; }
    .details { margin: 20px 0; }
    .footer { margin-top: 30px; color: #6c757d; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Payment Confirmation</h2>
    </div>
    <div class="details">
      <p>Dear Customer,</p>
      <p>Your payment has been successfully processed.</p>
      
      <h3>Payment Details:</h3>
      <ul>
        <li>Amount: $${payment.amount}</li>
        <li>Payment Method: ${payment.paymentMethod}</li>
        <li>Transaction ID: ${payment._id}</li>
        <li>Date: ${new Date(payment.createdAt).toLocaleDateString()}</li>
      </ul>

      <h3>Booking Details:</h3>
      <ul>
        <li>Booking ID: ${booking._id}</li>
        <li>Start Date: ${new Date(booking.startDate).toLocaleDateString()}</li>
        <li>End Date: ${new Date(booking.endDate).toLocaleDateString()}</li>
      </ul>
    </div>
    <div class="footer">
      <p>Thank you for choosing our service!</p>
      <p>Best regards,<br>Car Rental Team</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  paymentConfirmationTemplate
}; 