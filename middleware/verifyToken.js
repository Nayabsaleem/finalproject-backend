const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  try {
    // ✅ Token headers from frontend (Axios automatically sends it as Authorization: Bearer <token>)
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // ✅ Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // ✅ Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'replace_this_with_a_strong_secret'
    );

    // ✅ Attach user info to request (req.user ka use tum profile routes me kar rahi ho)
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
