const Joi = require("@hapi/joi");
const schema = {
  signup_post: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().alphanum().min(3).max(100).required(),
    fullname: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
  }),

  login: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().alphanum().min(3).max(100).required(),
    token: [Joi.string(), Joi.number()],
  }),
};

module.exports = schema;
