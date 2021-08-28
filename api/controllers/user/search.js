module.exports = {
  friendlyName: "Search User",

  description: "Search any user in our application.",

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: "pages/user/search",
    },

    notFound: {
      description: "There is no any user in the database.",
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    sails.log.debug("Show list of users");

    const users = await User.find({ id: { "!=": this.req.session.userId } });

    const currentUser = await User.findOne({ id: this.req.me.id }).populate(
      "following"
    );

    if (!users || !currentUser) {
      throw "notFound";
    }

    // set `isFollowing` field
    const followingDict = new Object();

    // save the key value for following users
    currentUser.following.forEach((f) => {
      followingDict[f.id] = f;
    });

    // set isFollowing to validate the users from the dictionary
    users.forEach((u) => {
      u.isFollowing = followingDict[u.id] != null;
    });

    const sanitizedUsers = users.map((u) => {
      return {
        id: u.id,
        fullName: u.fullName,
        emailAddress: u.emailAddress,
        isFollowing: u.isFollowing,
      };
    });

    if (this.req.wantsJSON) {
      return this.res.send(sanitizedUsers);
    }

    return exits.success({ users: sanitizedUsers });
  },
};
