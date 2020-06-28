const mailgun = require("mailgun-js");

const DOMAIN = "sandboxa5b709f1e6364eef9a595c247ffcbfdb.mailgun.org";
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: DOMAIN,
});
module.exports = {
  sendEmail: (from, to, subject, html) => {
    console.log("sending email");
    const data = { from, to, subject, html };
    return mg
      .messages()
      .send(data)
      .then(() => {
        return "OK";
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
};
