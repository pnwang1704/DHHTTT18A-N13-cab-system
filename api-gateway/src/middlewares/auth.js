const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(required = true) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      if (!required) return next();
      return res.status(401).json({ message: 'No token provided' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload; // { id, role, ... }
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};
