'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class symbols extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  symbols.init({
    SYMBOL: DataTypes.STRING,
    NAME: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'symbols',
  });
  return symbols;
};