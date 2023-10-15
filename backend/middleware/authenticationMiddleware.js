const jwt = require('jsonwebtoken');
const signature = 'khalil$b@y';

const authenticateUser = (req, res, next) => {
    const authToken = req.header('x-auth-token');
  
    if (!authToken) {
      return res.status(401).json({ status: false, error: 'Authorization token missing' });
    }    
  
    try {
      const decoded = jwt.verify(authToken, signature);
      req.user = decoded.user;
      next();
    } catch (error) {
      return res.status(401).json({ status: false, error: error.message });
    }
  };

  module.exports = {authenticateUser};