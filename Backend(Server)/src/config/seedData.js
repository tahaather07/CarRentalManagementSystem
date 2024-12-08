const User = require('../models/User');
const Branch = require('../models/Branch');
const Car = require('../models/Car');
const Category = require('../models/Category');
const Booking = require('../models/Booking');
const Inspection = require('../models/Inspection');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Create sample category
    const category = await Category.findOneAndUpdate(
      { name: 'Sedan' },
      {
        name: 'Sedan',
        description: 'Standard 4-door sedan',
        basePrice: 50.00
      },
      { upsert: true, new: true }
    );

    // Create sample branch
    const branch = await Branch.findOneAndUpdate(
      { name: 'Downtown Branch' },
      {
        name: 'Downtown Branch',
        address: '123 Main Street',
        city: 'Sample City',
        contactNumber: '555-0123',
        email: 'downtown@example.com',
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        }
      },
      { upsert: true, new: true }
    );

    // Update sample staff to be associated with the branch
    const staffUser = await User.findOneAndUpdate(
      { email: 'staff@example.com' },
      { $set: { branch: branch._id } },
      { new: true }
    );

    // Create sample car
    const car = await Car.findOneAndUpdate(
      { licensePlate: 'ABC123' },
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        category: category._id,
        licensePlate: 'ABC123',
        branch: branch._id,
        dailyRate: 75.00,
        status: 'available',
        features: ['Bluetooth', 'Backup Camera', 'Cruise Control'],
        mileage: 15000,
        transmission: 'automatic'
      },
      { upsert: true, new: true }
    );

    // Create sample customer
    const hashedPassword = await bcrypt.hash('customer123', 10);
    const customer = await User.findOneAndUpdate(
      { email: 'customer@example.com' },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'customer@example.com',
        password: hashedPassword,
        phoneNumber: '555-0124',
        role: 'customer',
        status: 'active'
      },
      { upsert: true, new: true }
    );

    // Create sample booking
    const booking = await Booking.findOneAndUpdate(
      { 
        customer: customer._id,
        car: car._id,
        startDate: new Date('2024-03-20')
      },
      {
        customer: customer._id,
        car: car._id,
        pickupBranch: branch._id,
        returnBranch: branch._id,
        startDate: new Date('2024-03-20'),
        endDate: new Date('2024-03-23'),
        status: 'confirmed',
        totalAmount: 225.00, // 3 days * $75
        paymentStatus: 'pending',
        paymentMethod: 'cash payment'
      },
      { upsert: true, new: true }
    );

    // Create sample inspection
    const inspection = await Inspection.findOneAndUpdate(
      {
        booking: booking._id,
        type: 'pre-rental'
      },
      {
        booking: booking._id,
        inspector: staffUser._id,
        type: 'pre-rental',
        condition: {
          exterior: 'Good condition',
          interior: 'Clean',
          mileage: 50000,
          fuelLevel: 0.75,
          damages: []
        },
        notes: 'Regular inspection',
        images: []
      },
      { upsert: true, new: true }
    );

    console.log('Sample data created successfully');
    console.log('Sample Booking ID:', booking._id);
    console.log('Sample Customer ID:', customer._id);
    console.log('Sample Car ID:', car._id);
    console.log('Sample Branch ID:', branch._id);
    console.log('Staff Branch ID:', staffUser.branch);
    console.log('Sample Inspection ID:', inspection._id);

    // Create second sample car
    const car2 = await Car.findOneAndUpdate(
      { licensePlate: 'XYZ789' },
      {
        make: 'Honda',
        model: 'Civic',
        year: 2023,
        category: category._id,
        licensePlate: 'XYZ789',
        branch: branch._id,
        dailyRate: 65.00,
        status: 'available',
        features: ['Apple CarPlay', 'Lane Departure Warning', 'Keyless Entry'],
        mileage: 8000,
        transmission: 'automatic'
      },
      { upsert: true, new: true }
    );

    // Create second sample customer
    const hashedPassword2 = await bcrypt.hash('customer456', 10);
    const customer2 = await User.findOneAndUpdate(
      { email: 'jane.smith@example.com' },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: hashedPassword2,
        phoneNumber: '555-0125',
        role: 'customer',
        status: 'active'
      },
      { upsert: true, new: true }
    );

    // Create second sample booking
    const booking2 = await Booking.findOneAndUpdate(
      { 
        customer: customer2._id,
        car: car2._id,
        startDate: new Date('2024-03-25')
      },
      {
        customer: customer2._id,
        car: car2._id,
        pickupBranch: branch._id,
        returnBranch: branch._id,
        startDate: new Date('2024-03-25'),
        endDate: new Date('2024-03-27'),
        status: 'pending',
        totalAmount: 130.00, // 2 days * $65
        paymentStatus: 'pending',
        paymentMethod: 'credit card'
      },
      { upsert: true, new: true }
    );

    // Create second sample inspection
    const inspection2 = await Inspection.findOneAndUpdate(
      {
        booking: booking2._id,
        type: 'pre-rental'
      },
      {
        booking: booking2._id,
        inspector: staffUser._id,
        type: 'pre-rental',
        condition: {
          exterior: 'Excellent condition',
          interior: 'Like new',
          mileage: 8000,
          fuelLevel: 1.0,
          damages: []
        },
        notes: 'New vehicle inspection',
        images: []
      },
      { upsert: true, new: true }
    );

    // Add additional console logs
    console.log('Second Sample Booking ID:', booking2._id);
    console.log('Second Sample Customer ID:', customer2._id);
    console.log('Second Sample Car ID:', car2._id);
    console.log('Second Sample Inspection ID:', inspection2._id);

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase; 