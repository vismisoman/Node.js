const Joi = require("@hapi/joi");
const { signup_post, login } = require("./signup-post.schema");

const checkErrors = function (res, next, result) {
  if (result.error) {
    res.json({ success: false, data: result.error.details[0].message });
  } else {
    next();
  }
};

module.exports = {
  signupValidation: async (req, res, next) => {
    const result = await signup_post.validate(req.body);
    checkErrors(res, next, result);
  },
  loginValidation: async (req, res, next) => {
    const result = await login.validate(req.body);
    checkErrors(res, next, result);
  },
};
