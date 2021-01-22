const bcrypt = require("bcrypt-nodejs");

module.exports = class CommonService {
    constructor() {
    }
    async generatePasswordHash(password) {
        return await bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    async compareHashes(user, password) {
        return await bcrypt.compareSync(password, user.password);
    }

}