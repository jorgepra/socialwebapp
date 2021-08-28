module.exports = {
  friendlyName: "Create",

  description: "Create comment.",

  inputs: {
    id: {
      type: "string",
      required: true,
    },
    text: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      responseType: "ok",
      description: "Comment successfully created.",
    },
    json: {
      responseType: "ok",
      description: "json response was sent",
    },
  },

  fn: async function (inputs, exits) {
    const postId = inputs.id;
    const postText = inputs.text;
    const currentUserId = this.req.me.id;

    sails.log.warn("text: " + postText);
    sails.log.warn("creating a comment " + postId);

    await Comment.create({ user: currentUserId, post: postId, text: postText });
    // All done.
    return exits.success();
  },
};
