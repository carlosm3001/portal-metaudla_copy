const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('Auth middleware: Checking for token...');
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth middleware: No token or invalid format.');
    return res.status(401).json({ message: 'No token or invalid format, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Auth middleware: Token found:', token ? 'Yes' : 'No');

  if (!token) {
    console.log('Auth middleware: No token found in Authorization header.');
    return res.status(401).json({ message: 'No token found in Authorization header' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Auth middleware: Token verified. User:', req.user);
    next();
  } catch (error) {
    console.log('Auth middleware: Token verification failed:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
      return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions' });
    }
    next();
  };
};

module.exports = { auth, authorize };
