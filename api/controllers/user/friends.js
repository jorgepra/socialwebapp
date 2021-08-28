module.exports = {
  friendlyName: "Friends",

  description: "Friends user.",

  inputs: {},

  exits: {
    success: {
      responseType: "ok",
    },
  },

  fn: async function (inputs, exits) {
    const currentUserId = this.req.me.id;
    const currentUser = await User.findOne({ id: currentUserId })
      .populate("following")
      .populate("followers");

    const followingDict = new Object();

    // save the key value for following users
    currentUser.following.forEach((f) => {
      followingDict[f.id] = f;
    });

    var users = [];

    // check if the user follows me
    currentUser.followers.forEach((u) => {
      if (followingDict[u.id] != null) {
        users.push(followingDict[u.id]);
      }
    });

    return exits.success(users);
  },
};
