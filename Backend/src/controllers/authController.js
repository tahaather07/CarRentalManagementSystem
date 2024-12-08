const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
  // Login endpoint
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is staff or admin
      if (!['staff', 'admin'].includes(user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          branch: user.branch
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add sample staff (for development purposes)
  addSampleStaff: async () => {
    try {
      // Check if sample staff already exists
      const existingStaff = await User.findOne({ email: 'staff@example.com' });
      if (existingStaff) {
        console.log('Sample staff already exists');
        return;
      }

      // Create sample branch first
      const Branch = require('../models/Branch');
      let branch = await Branch.findOne({ name: 'Downtown Branch' });
      
      if (!branch) {
        branch = new Branch({
          name: 'Downtown Branch',
          address: '123 Main Street',
          city: 'Sample City',
          contactNumber: '555-0123',
          email: 'downtown@example.com',
          coordinates: {
            latitude: 40.7128,
            longitude: -74.0060
          }
        });
        await branch.save();
      }

      // Hash password
      const hashedPassword = await bcrypt.hash('staff123', 10);

      // Create sample staff
      const sampleStaff = new User({
        firstName: 'Sample',
        lastName: 'Staff',
        email: 'staff@example.com',
        password: hashedPassword,
        phoneNumber: '1234567890',
        role: 'staff',
        branch: branch._id,
        status: 'active'
      });

      await sampleStaff.save();
      console.log('Sample staff created successfully with branch:', branch._id);
    } catch (error) {
      console.error('Error creating sample staff:', error);
    }
  }
};

module.exports = authController; 