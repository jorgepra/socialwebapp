module.exports = {
  friendlyName: "Like",

  description: "Like feeditem.",

  inputs: {
    postId: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      responseType: "ok",
      description: "Returns ok response for post like route ",
    },
  },

  fn: async function (inputs, exits) {
    const postId = inputs.postId;
    const currentUserId = this.req.me.id;

    try {
      // update the like feed to true
      await FeedItem.update({ post: postId, user: currentUserId }).set({
        hasLiked: true,
      });

      // create record of the liked post
      await Like.create({
        user: currentUserId,
        post: postId,
      });

      const numLikes = await Like.count({ post: postId });

      // update number of likes
      await Post.update({ id: postId }).set({
        numLikes: numLikes,
      });

      // update `hasLiked` only if it's my post
      await Post.update({ id: postId, user: currentUserId }).set({
        hasLiked: true,
      });

      return exits.success();
    } catch (error) {
      console.log(error.toString());
    }
  },
};
