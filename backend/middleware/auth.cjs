const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token or invalid format, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    // This case is technically covered by the startsWith check, but it's good for robustness
    return res.status(401).json({ message: 'No token found in Authorization header' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
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
