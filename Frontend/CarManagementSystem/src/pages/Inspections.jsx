import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import axios from 'axios';

function InspectionForm({ booking, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'pre-rental',
    condition: {
      exterior: '',
      interior: '',
      mileage: '',
      fuelLevel: '',
      damages: ['']
    },
    notes: '',
    images: []
  });

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploadedImageUrls = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('upload_preset', 'carRentalPreset'); // Replace with your Cloudinary upload preset

      try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/diwlpdzqh/image/upload', formData);
        uploadedImageUrls.push(response.data.secure_url); // Get the URL of the uploaded image
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    setFormData({ ...formData, images: uploadedImageUrls });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, booking: booking._id });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">New Inspection</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full border rounded-md p-2"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="pre-rental">Pre-rental</option>
              <option value="post-rental">Post-rental</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
            <input
              type="number"
              className="w-full border rounded-md p-2"
              value={formData.condition.mileage}
              onChange={(e) => setFormData({
                ...formData,
                condition: {...formData.condition, mileage: e.target.value}
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Level (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full border rounded-md p-2"
              value={formData.condition.fuelLevel * 100}
              onChange={(e) => setFormData({
                ...formData,
                condition: {...formData.condition, fuelLevel: e.target.value / 100}
              })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Exterior Condition</label>
            <textarea
              className="w-full border rounded-md p-2"
              rows="3"
              value={formData.condition.exterior}
              onChange={(e) => setFormData({
                ...formData,
                condition: {...formData.condition, exterior: e.target.value}
              })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Interior Condition</label>
            <textarea
              className="w-full border rounded-md p-2"
              rows="3"
              value={formData.condition.interior}
              onChange={(e) => setFormData({
                ...formData,
                condition: {...formData.condition, interior: e.target.value}
              })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="w-full border rounded-md p-2"
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="border rounded-md p-2"
            />
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
            >
              Submit Inspection
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function InspectionList({ inspections }) {
  return (
    <div className="space-y-4">
      {inspections.map((inspection) => (
        <div key={inspection._id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="font-semibold">{inspection.type === 'pre-rental' ? 'Pre-rental' : 'Post-rental'} Inspection</span>
              <p className="text-sm text-gray-500">
                {new Date(inspection.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="text-sm text-gray-500">
              By: {inspection.inspector.firstName} {inspection.inspector.lastName}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Condition</h4>
              <p className="text-sm">Mileage: {inspection.condition.mileage}</p>
              <p className="text-sm">Fuel Level: {inspection.condition.fuelLevel * 100}%</p>
            </div>
            <div>
              <h4 className="font-medium">Notes</h4>
              <p className="text-sm">{inspection.notes}</p>
            </div>
          </div>

          {/* Display Images */}
          {inspection.images.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {inspection.images.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Inspection Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md" // Standard size for all images
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Inspections() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [inspections, setInspections] = useState([]);
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

  const fetchInspections = async (bookingId) => {
    try {
      const response = await bookingsAPI.getInspections(bookingId);
      setInspections(response.data);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    }
  };

  const handleBookingSelect = (bookingId) => {
    const booking = bookings.find(b => b._id === bookingId);
    setSelectedBooking(booking);
    fetchInspections(bookingId);
  };

  const handleInspectionSubmit = async (formData) => {
    try {
      await bookingsAPI.createInspection(formData);
      fetchInspections(selectedBooking._id);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating inspection:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Vehicle Inspections</h1>
      
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
                  {booking.car.make} {booking.car.model} - {new Date(booking.startDate).toLocaleDateString()}
                </option>
              ))}
            </select>

            {selectedBooking && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                New Inspection
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          {showForm && selectedBooking ? (
            <InspectionForm
              booking={selectedBooking}
              onSubmit={handleInspectionSubmit}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <InspectionList inspections={inspections} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Inspections; 