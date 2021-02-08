const { Container } = require('typedi');
const createError = require('http-errors');

module.exports = class AuthService {
  constructor() {
    this.user = Container.get('user');
    this.Commons = Container.get('CommonServiceInstance');
    this.TokenService = Container.get('TokenServiceInstance');
  }

  async signup(username, password) {
    try {
      // Salt hash password
      password = await this.Commons.generatePasswordHash(password);

      const response = await this.user.create({ username, password });
      const output = { id: response.id, username: response.username };
      return output;
    } catch (error) {
      throw error;
    }
  }

  async login(username, password) {
    try {
      const userInfo = await this.user.findOne({
        where: { username },
      });
      if (!userInfo) {
        throw createError(401, 'unauthorized');
      }
      if (await this.Commons.compareHashes(userInfo, password)) {
        return {
          data: await this.TokenService.createAndRegisterToken(userInfo),
        };
      } else {
        throw createError(401, 'unauthorized');
      }
    } catch (error) {
      throw error;
    }
  }
};
