
module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.Model { }
  User.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, { sequelize, modelName: 'user' });
  return User;
};