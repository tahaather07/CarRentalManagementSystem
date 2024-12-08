import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';

function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
}

function Bookings() {
  const [bookings, setBookings] = useState([]);
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

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus);
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{`${booking.customer.firstName} ${booking.customer.lastName}`}</div>
                    <div className="text-sm text-gray-500">{booking.customer.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{`${booking.car.make} ${booking.car.model}`}</div>
                    <div className="text-sm text-gray-500">{booking.car.licensePlate}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">to</div>
                    <div>{new Date(booking.endDate).toLocaleDateString()}</div>
                  </div>
                </td>
                <td className="px-6 py-4">${booking.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <PaymentStatusBadge status={booking.paymentStatus} />
                    <div className="text-sm text-gray-500">
                      {booking.paymentMethod.replace('_', ' ')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={booking.status}
                    onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                    disabled={booking.status === 'cancelled'}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bookings; 