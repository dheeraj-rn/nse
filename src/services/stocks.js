const { Container } = require('typedi');

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
};
