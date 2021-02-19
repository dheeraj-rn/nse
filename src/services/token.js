const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = class TokenService {
  constructor() {
    this.JWT_SECRET = config.env.jwt_secret;
  }

  async createAndRegisterToken(user) {
    const access_token = jwt.sign({ id: user.id, username: user.username }, this.JWT_SECRET, {
      expiresIn: 86400 * 30, // expires in 30 days
    });
    return {
      access_token,
    };
  }
};
