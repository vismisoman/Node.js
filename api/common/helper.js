module.exports = {
  getActivationHtml: (activationToken) => {
    return Promise.resolve(
      `<h2>Please click on the given link to activate your account</h2><p> ${process.env.CLIENT_URL}/authentication/activate/${activationToken}</p>`
    );
  },
  getPasswordResetHtml: (activationToken) => {
    return Promise.resolve(
      `<h2>Please click on the given link to reset your password</h2><p> ${process.env.CLIENT_URL}/authentication/resetpassword/${activationToken}</p>`
    );
  },
  getPasswordResetSuccessHtml: () => {
    return Promise.resolve(
      `<h2>Your password has successfully updated</h2></p>`
    );
  },
};
