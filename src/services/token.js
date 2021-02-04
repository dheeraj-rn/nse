const config = require("../config");
const jwt = require("jsonwebtoken");

module.exports = class TokenService {
    constructor() {
    }

    async createAndRegisterToken(user) {
        let access_token = jwt.sign({ id: user.id, username: user.username }, config.env.jwt_secret, {
            expiresIn: 86400 * 30 // expires in 30 days
        });
        return {
            access_token
        };
    }
    // verifyToken(req, res, next) {
    //     var token = req.headers["x-access-token"];
    //     if (!token)
    //         return respond(
    //             res,
    //             Constants.RESPONSE_CODES.UN_AUTHORIZED,
    //             'Unauthorised'
    //         );
    //     jwt.verify(token, config.jwt_secret, async (err, decoded) => {
    //         if (err)
    //             return respond(
    //                 res,
    //                 401,
    //                 'Unauthorised'
    //             );

    //         let user = await User.findOne({
    //             where: { id: decoded.id }
    //         });

    //         if (!user)
    //             return respond(
    //                 res,
    //                 Constants.RESPONSE_CODES.UN_AUTHORIZED,
    //                 'Unauthorised'
    //             );
    //         else next();
    //     });
    // }
}