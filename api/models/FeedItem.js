module.exports = {
  attributes: {
    post: {
      model: "post",
      required: true,
    },
    postOwner: {
      model: "user",
      required: true,
    },
    user: {
      model: "user",
      required: true,
    },
    postCreatedAt: {
      type: "number",
    },
    hasLiked: {
      type: "boolean",
      defaultsTo: false,
    },
  },
};
