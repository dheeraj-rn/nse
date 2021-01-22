const { Sequelize } = require('sequelize');

const config = require('../config');

module.exports = () => {

    const sequelize = new Sequelize(config.pg_url, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: true,
            rejectUnauthorized: false
        }
    });
    return sequelize;
};
