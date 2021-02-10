const { Container } = require('typedi');
const { Op } = require('sequelize');

module.exports = class StockService {
  constructor() {
    this.stocks = Container.get('stocks');
  }

  async getall() {
    try {
      const response = await this.stocks.findAll();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async search(searchTerm) {
    try {
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
      return response;
    } catch (error) {
      throw error;
    }
  }
};
