module.exports = {
  friendlyName: "Unfollow",

  description: "Unfollow user.",

  inputs: {
    id: {
      description: "The user id from the user to follow",
      type: "string",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs) {
    sails.log.warn(
      "The user with id " + inputs.id + " has been unfollowed by me"
    );

    // association
    const currentUserId = this.req.me.id;
    const userIdToUnFollow = inputs.id;
    await User.removeFromCollection(
      currentUserId,
      "following",
      userIdToUnFollow
    );

    //destroy feed items from following user
    await FeedItem.destroy({
      postOwner: userIdToUnFollow,
      user: currentUserId,
    });

    await User.removeFromCollection(
      userIdToUnFollow,
      "followers",
      currentUserId
    );
    return;
  },
};
