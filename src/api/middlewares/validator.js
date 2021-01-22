const { Joi } = require('celebrate');

module.exports = {

  signup: {
    body: Joi.object({
      username: Joi.string()
        .alphanum()
        .min(4)
        .max(30)
        .required(),
      password: Joi.string()
        .min(4)
        .max(30)
        .required(),
    })
      .options({ stripUnknown: true })
  }
};
