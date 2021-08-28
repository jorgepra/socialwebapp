module.exports = {
  friendlyName: "Delete",

  description: "Delete feeditem.",

  inputs: {
    postId: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      responseType: "ok",
      description: "Returns ok response from api/response/ok.js",
    },
    invalid: {
      description: "This was an invalid post to delete",
    },
  },

  fn: async function (inputs, exits) {
    sails.log.warn("Trying to delete post with id " + inputs.postId);
    const currentUserId = this.req.me.id;

    try {
      // delete in my feedItem and my followers too
      await FeedItem.destroy({
        post: inputs.postId,
        user: currentUserId,
      });

      return exits.success();
    } catch (err) {
      console.log(err.toString());
    }
  },
};
