module.exports = {
  friendlyName: "Profile",

  description: "Profile user.",

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: "pages/user/profile",
    },

    notFound: {
      description: "There is no any user in the database.",
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    const currentUserId = this.req.me.id;

    const currentUser = await User.findOne({ id: currentUserId })
      .populate("following")
      .populate("followers");

    if (!currentUser) {
      throw "notFound";
    }

    const posts = await Post.find({ user: currentUserId })
      .populate("user")
      .sort("createdAt DESC");

    // enabled delete only in this action
    posts.forEach((p) => {
      p.canDelete = true;
    });

    currentUser.posts = posts;

    const sanitizedUser = JSON.parse(JSON.stringify(currentUser));

    if (this.req.wantsJSON) {
      return this.res.send(sanitizedUser);
    }

    return exits.success({ user: sanitizedUser });
  },
};
