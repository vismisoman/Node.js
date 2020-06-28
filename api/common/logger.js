module.exports = {
  log: (msg, payload) => {
    console.log(msg + " : ", payload ? JSON.stringify(payload) : "");
  },
};
