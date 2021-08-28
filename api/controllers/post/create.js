module.exports = {
  friendlyName: "Create Post",

  description: "Create post in mongo database.",

  inputs: {
    postText: {
      description: "The post text from our home page",
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      responseType: "ok",
      description: "Successfully created.",
    },
    notSaved: {
      description: "The post record was not saved",
      responseType: "notSaved",
    },
  },

  fn: async function (inputs, exits) {
    const file = this.req.file("imageFile");
    const currentUserId = this.req.me.id;
    sails.log.warn({ file: file });

    const fileUrl = await sails.helpers.uploadfile.with({
      file: file,
    });

    const postCreated = await Post.create({
      text: inputs.postText,
      imageUrl: fileUrl,
      user: currentUserId,
    }).fetch();

    if (!postCreated) {
      throw "notSaved";
    }

    // add my created post at my feed
    await FeedItem.create({
      postOwner: currentUserId,
      post: postCreated.id,
      user: currentUserId,
      postCreatedAt: postCreated.createdAt,
    });

    // add my created post at my followers feed
    const user = await User.findOne({ id: currentUserId }).populate(
      "followers"
    );

    user.followers.forEach(async (f) => {
      await FeedItem.create({
        postOwner: currentUserId,
        post: postCreated.id,
        user: f.id,
        postCreatedAt: postCreated.createdAt,
      });
    });

    sails.log.debug(JSON.parse(JSON.stringify(postCreated)));
    return exits.success();
  },
};
