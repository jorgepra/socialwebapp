module.exports = {
  friendlyName: "DisLike",

  description: "DisLike feeditem.",

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
      await FeedItem.update({ post: postId, user: currentUserId }).set({
        hasLiked: false,
      });

      // create record of the disliked post
      await Like.destroy({
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
        hasLiked: false,
      });

      return exits.success();
    } catch (error) {
      console.log(error.toString());
    }
  },
};
