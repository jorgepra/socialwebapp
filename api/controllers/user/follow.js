module.exports = {
  friendlyName: "Following",

  description: "Following user.",

  inputs: {
    id: {
      description: "The user id from the user to follow",
      type: "string",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs) {
    sails.log.warn(" I am following the user with id: ", inputs.id);

    // association
    const currentUserId = this.req.me.id;
    const userIdToFollow = inputs.id;

    await User.addToCollection(currentUserId, "following", userIdToFollow);

    // find all post of the user that im following
    const postFromUserToFollow = await Post.find({ user: userIdToFollow });

    // add their posts on my feed
    postFromUserToFollow.forEach(async (p) => {
      await FeedItem.create({
        post: p.id,
        user: currentUserId,
        postOwner: userIdToFollow,
        postCreatedAt: p.createdAt,
      });
      sails.log.debug(p.text);
    });

    // add followers to the user userIdToFollow
    await User.addToCollection(userIdToFollow, "followers", currentUserId);
    return;
  },
};
