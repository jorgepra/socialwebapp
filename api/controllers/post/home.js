module.exports = {
  friendlyName: "Posts Home",

  description: "Home page of all posts.",

  inputs: {},

  exits: {
    success: {
      viewTemplatePath: "pages/post/home",
    },

    notFound: {
      description: "There is no any post in the database.",
      responseType: "notFound",
    },
  },

  fn: async function (inputs, exits) {
    const currentUserId = this.req.me.id;
    var allPosts = [];

    // fetch only the posts from my feed
    const feedItems = await FeedItem.find({ user: currentUserId })
      .populate("post")
      .populate("postOwner")
      .sort("postCreatedAt DESC");

    feedItems.forEach((fi) => {
      if (fi.post) {
        fi.post.user = fi.postOwner; // the post user is the owner of each item in my feed
        fi.post.canDelete = fi.post.user.id == currentUserId; // if I am the post owner , can delete it
        fi.post.hasLiked = fi.hasLiked;
        allPosts.push(fi.post);
      }
    });

    if (!allPosts) {
      //throw "notFound";
      sails.log.warn("there is no post to show you");
    }

    // is enabled to comment
    allPosts.forEach((p) => {
      p.isEnabledCommentLink = true;
    });

    if (this.req.wantsJSON) {
      return this.res.send(allPosts);
    }

    // Only display some fields to the user in each post
    const string = JSON.stringify(allPosts);
    const objects = JSON.parse(string);

    sails.log.debug("Posts in my feed: " + allPosts.length);
    return exits.success({ allPosts: objects });
  },
};
