module.exports = {
  attributes: {
    post: {
      model: "post",
      required: true,
    },
    user: {
      model: "user",
      required: true,
    },
    text: {
      type: "string",
      required: true,
    },
  },
};
