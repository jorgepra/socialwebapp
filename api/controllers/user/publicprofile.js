module.exports = {
  friendlyName: "Publicprofile",

  description: "Publicprofile user.",

  inputs: {
    id: {
      description: "The public information of the user",
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      viewTemplatePath: "pages/user/publicprofile",
    },

    notFound: {
      description: "There is no any user in the database with this id.",
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    const user = await User.findOne({ id: inputs.id })
      .populate("following")
      .populate("followers");

    if (!user) {
      throw "notFound";
    }

    const posts = await Post.find({ user: inputs.id })
      .populate("user")
      .sort("createdAt DESC");

    if (!posts) {
      throw "notFound";
    }

    user.posts = posts;

    user.followers.forEach((f) => {
      if (f.id === this.req.me.id) {
        user.isFollowing = true;
      }
    });

    // this makes sure 'user' is printed out using customToJSON
    const sanitizedUser = JSON.parse(JSON.stringify(user));
    sanitizedUser.isFollowing = user.isFollowing;

    if (this.req.wantsJSON) {
      return this.res.send(sanitizedUser);
    }

    return exits.success({ user: sanitizedUser });
  },
};
