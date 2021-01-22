// const { Sequelize } = require('sequelize');
// const User = Sequelize.import("../models/user");
const initModels = require("../models/init-models");
const models = initModels(postgresConn);
const commonService = require("./commons");

module.exports = class AuthService {
    constructor() {
        this.Commons = new commonService();
    }
    async signup(username, password) {

        // Salt hash password
        password = await this.Commons.generatePasswordHash(password);

        let err = null;
        let response = await models.User.sequelize
            .transaction(async t => {
                let user = await User.create({ username, password }, { transaction: t });
                return user;
            })
            .catch(error => {
                console.error(error);
                err = error.message;
            });
        if (err) throw (err);
        else
            return response;
    }

}