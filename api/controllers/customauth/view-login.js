module.exports = {
  friendlyName: "Custom View login",

  description: 'Display custom "Login" page.',

  exits: {
    success: {
      viewTemplatePath: "pages/customauth/login",
    },
  },

  fn: async function () {
    // Respond with view.
    console.log("custom login");
    return {};
  },
};
