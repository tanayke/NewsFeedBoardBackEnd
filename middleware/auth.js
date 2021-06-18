const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

// eslint-disable-next-line consistent-return
module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'NO token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
