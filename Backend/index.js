require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./src/config/database');
const seedDatabase = require('./src/config/seedData');
const staffRoutes = require('./src/routes/staffRoutes');
const authRoutes = require('./src/routes/authRoutes');
const authController = require('./src/controllers/authController');

const app = express();

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request made to: ${req.url}`);
  next(); // Pass control to the next middleware or route handler
});

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true
}));
app.use(express.json());

// Connect to database
connectDatabase().then(async () => {
  try {
    // Create sample staff and data after database connection
    await authController.addSampleStaff();
    await seedDatabase();
  } catch (error) {
    console.error('Error in database initialization:', error);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
