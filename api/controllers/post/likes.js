module.exports = {
  friendlyName: "Likes",

  description: "Likes post.",

  inputs: {
    postId: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      responseType: "ok",
      description: "Returns success response for the users who liked the post ",
    },
    json: {
      responseType: "ok",
      description: "Returns the users who liked the post",
    },
  },

  fn: async function (inputs, exits) {
    const postId = inputs.postId;
    //const currentUserId = this.req.me.id;
    var users = [];
    const likes = await Like.find({ post: postId }).populate("user");

    //likedPostUsers.forEach((lpu) => {
    //  users.push(lpu.user);
    //});

    if (this.req.wantsJSON) {
      return exits.json(likes);
    }

    return exits.success({ users: JSON.parse(JSON.stringify(likes)) });
  },
};
