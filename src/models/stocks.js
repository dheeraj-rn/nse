'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  stocks.init({
    SYMBOL: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    NAME: DataTypes.STRING,
    SERIES: DataTypes.STRING,
    OPEN: DataTypes.STRING,
    HIGH: DataTypes.STRING,
    LOW: DataTypes.STRING,
    CLOSE: DataTypes.STRING,
    LAST: DataTypes.STRING,
    PREVCLOSE: DataTypes.STRING,
    TOTTRDQTY: DataTypes.STRING,
    TOTTRDVAL: DataTypes.STRING,
    TIMESTAMP: DataTypes.STRING,
    TOTALTRADES: DataTypes.STRING,
    ISIN: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'stocks',
  });
  return stocks;
};