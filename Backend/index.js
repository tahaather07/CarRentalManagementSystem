require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./src/config/database');
const seedDatabase = require('./src/config/seedData');
const staffRoutes = require('./src/routes/staffRoutes');
const authRoutes = require('./src/routes/authRoutes');
const authController = require('./src/controllers/authController');

const app = express();
// CORS configuration - Placed at the top
const corsOptions = {
  origin: ['http://localhost:5173', 'https://carrentalmanagementsystem.onrender.com', 'http://localhost'], // Allow your frontend origins
  credentials: true, // Important for cookies, authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Middleware to log outgoing headers
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function () {
    console.log('Response Headers:', res.getHeaders());
    originalSend.apply(res, arguments);
  };
  next();
});

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request made to: ${req.url}`);
  console.log('Request Headers:', req.headers);
  next();
});

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
