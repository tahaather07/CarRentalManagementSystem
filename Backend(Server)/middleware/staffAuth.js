const jwt = require('jsonwebtoken');
const User = require('../models/User');

const staffAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, role: { $in: ['staff', 'admin'] } });

    if (!user || user.status !== 'active') {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate as staff' });
  }
};

module.exports = staffAuth; 