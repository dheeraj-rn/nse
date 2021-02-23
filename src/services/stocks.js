const { Container } = require('typedi');
const { Op } = require('sequelize');

module.exports = class StockService {
  constructor() {
    this.stocks = Container.get('stocks');
    this.RedisClient = Container.get('RedisClient');
  }

  async getall() {
    try {
      const cachedShares = await this.RedisClient.get('AllShares');
      if (cachedShares) {
        const response = JSON.parse(cachedShares);
        console.log('Serving From Redis');
        return response;
      } else {
        const response = await this.stocks.findAll({
          order: [
            ['updatedAt', 'DESC'],
          ]
        });
        this.RedisClient.set('AllShares', JSON.stringify(response));
        return response;
      }
    } catch (error) {
      throw error;
    }
  }

  async search(searchTerm) {
    try {
      const cachedSearch = await this.RedisClient.get(`search:${searchTerm}`);
      if (cachedSearch) {
        const response = JSON.parse(cachedSearch);
        console.log('Serving From Redis');
        return response;
      } else {
        const response = await this.stocks.findAll({
          where: {
            [Op.or]: [{
              SYMBOL: { [Op.eq]: searchTerm },
            },
            {
              NAME: { [Op.eq]: searchTerm },
            }],
          },
        });
        this.RedisClient.set(`search:${searchTerm}`, JSON.stringify(response));
        return response;
      }
    } catch (error) {
      throw error;
    }
  }
};
