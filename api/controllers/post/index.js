module.exports = {
  friendlyName: "Index",

  description: "Index post.",

  inputs: {
    id: {
      type: "string",
      required: true,
      description: "the post id to see a detailed page",
    },
  },

  exits: {
    success: {
      viewTemplatePath: "pages/post/index",
    },
    json: {
      responseType: "ok",
      description: "json response was sent",
    },
  },

  fn: async function (inputs, exits) {
    console.log("This is post detailed page" + inputs.id);
    const postId = inputs.id;

    const post = await Post.findOne({ id: postId }).populate("user");

    const comments = await Comment.find({ post: postId })
      .populate("user")
      .sort("createdAt DESC");

    comments.forEach((c) => {
      c.fromNow = sails.moment(c.createdAt).fromNow();
    });

    post.comments = comments;

    if (this.req.wantsJSON) {
      //return this.res.send(post);
      return exits.json(post);
    }

    const sanitizedPost = JSON.parse(JSON.stringify(post));
    return exits.success({ post: sanitizedPost });
  },
};
