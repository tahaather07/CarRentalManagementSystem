import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';

function PaymentForm({ booking, onSubmit, onCancel }) {
  const [amount, setAmount] = useState(booking.totalAmount);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment form submitted with data:', {
      bookingId: booking._id,
      amount,
      paymentMethod
    });
    onSubmit({
      bookingId: booking._id,
      amount,
      paymentMethod
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Process Payment</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              className="w-full border rounded-md p-2"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              className="w-full border rounded-md p-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Payment Status</label>
            <div className={`px-3 py-1 rounded-full text-sm inline-block
              ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                booking.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
              {booking.paymentStatus}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={booking.paymentStatus === 'paid'}
          >
            Process Payment
          </button>
        </div>
      </form>
    </div>
  );
}

function PaymentHistory({ payments }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getDisplayPaymentMethod = (method) => {
    switch (method) {
      case 'cash':
        return 'Cash Payment';
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        No payment records found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processed By</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td className="px-6 py-4">
                {new Date(payment.createdAt).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                ${payment.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 capitalize">
                {getDisplayPaymentMethod(payment.paymentMethod)}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.paymentIntent?.status)}`}>
                  {payment.paymentIntent?.status || 'pending'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  payment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  payment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  payment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  payment.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.status}
                </span>
              </td>
              <td className="px-6 py-4">
                {payment.paidBy?.firstName} {payment.paidBy?.lastName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Payments() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (bookingId) => {
    console.log('Fetching payments for booking:', bookingId);
    try {
      const response = await bookingsAPI.getPaymentDetails(bookingId);
      console.log('Fetched payments:', response.data);
      const paymentsData = response.data;
      setPayments(Array.isArray(paymentsData) ? paymentsData : [paymentsData].filter(Boolean));
    } catch (error) {
      console.error('Error fetching payments:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setPayments([]);
    }
  };

  const handleBookingSelect = (bookingId) => {
    const booking = bookings.find(b => b._id === bookingId);
    setSelectedBooking(booking);
    fetchPayments(bookingId);
  };

  const handlePaymentSubmit = async (paymentData) => {
    console.log('Attempting to process payment:', paymentData);
    try {
      const formattedData = {
        bookingId: paymentData.bookingId,
        amount: Number(paymentData.amount),
        paymentMethod: paymentData.paymentMethod
      };
      
      console.log('Formatted payment data:', formattedData);
      const response = await bookingsAPI.processPayment(formattedData);
      console.log('Payment processing response:', response);
      await fetchPayments(selectedBooking._id);
      setShowForm(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-4">Select Booking</h2>
            <select
              className="w-full border rounded-md p-2"
              onChange={(e) => handleBookingSelect(e.target.value)}
              value={selectedBooking?._id || ''}
            >
              <option value="">Select a booking...</option>
              {bookings.map((booking) => (
                <option key={booking._id} value={booking._id}>
                  {booking.car.make} {booking.car.model} - ${booking.totalAmount}
                </option>
              ))}
            </select>

            {selectedBooking && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Process Payment
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          {showForm && selectedBooking ? (
            <PaymentForm
              booking={selectedBooking}
              onSubmit={handlePaymentSubmit}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <PaymentHistory payments={payments} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Payments; 