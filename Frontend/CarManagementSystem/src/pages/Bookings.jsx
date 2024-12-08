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
    <div className="p-2 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Bookings</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm md:text-base font-medium">{`${booking.customer.firstName} ${booking.customer.lastName}`}</div>
                      <div className="text-xs md:text-sm text-gray-500">{booking.customer.email}</div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm md:text-base font-medium">{`${booking.car.make} ${booking.car.model}`}</div>
                      <div className="text-xs md:text-sm text-gray-500">{booking.car.licensePlate}</div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div>
                      <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                      <div className="text-xs md:text-sm text-gray-500">to</div>
                      <div>{new Date(booking.endDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">${booking.totalAmount.toFixed(2)}</td>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <PaymentStatusBadge status={booking.paymentStatus} />
                      <div className="text-xs md:text-sm text-gray-500">
                        {booking.paymentMethod.replace('_', ' ')}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
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
    </div>
  );
}

export default Bookings; 