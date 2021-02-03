const { Container } = require('typedi');

module.exports = class AuthService {
    constructor() {
        this.user = Container.get('user');
        this.Commons = Container.get('CommonServiceInstance');
    }

    async signup(username, password) {
        try {
            // Salt hash password
            password = await this.Commons.generatePasswordHash(password);

            let response = await this.user.create({ username, password });
            let output = { id: response.id, username: response.username };
            return output;
        } catch (error) {
            throw error;
        }
    }
}