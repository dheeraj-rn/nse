const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { Container } = require('typedi');
const config = require('../../config');

module.exports = {

  verifyToken(req, res, next) {
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) {
      return next(createError(401, 'unauthorized'));
    }
    const token = bearerHeader.split(' ')[1];
    if (!token) {
      return next(createError(401, 'unauthorized'));
    }
    jwt.verify(token, config.env.jwt_secret, async (err, decoded) => {
      if (err) {
        return next(createError(401, 'unauthorized'));
      }
      const user = Container.get('user');
      const userInfo = await user.findOne({
        where: { id: decoded.id },
      });

      if (!userInfo) {
        return next(createError(401, 'unauthorized'));
      } else {
        return next();
      }
    });
  },

};
