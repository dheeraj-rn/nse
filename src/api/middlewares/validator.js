const { Joi, celebrate } = require('celebrate');

module.exports = {

  auth: celebrate({
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
      .options({ stripUnknown: true }),
  }),
};
