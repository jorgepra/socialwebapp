module.exports = {
  friendlyName: "Update account settings",

  description: "Update account setting of the user",

  files: ["imageFile"],

  inputs: {
    fullName: {
      description: "user full name",
      type: "string",
      required: true,
    },

    bio: {
      description: "user bio",
      type: "string",
      required: true,
    },

    imageFile: {
      description: "image avatar",
      example: "===",
      type: "ref",
    },
  },

  exits: {
    serverError: {
      responseType: "server error",
      description: `Failed to upload the file`,
    },
    redirect: {
      description:
        "after creating post on the web app, the user is redirected.",
      responseType: "redirect",
    },
    success: {
      responseType: "ok",
      description: "Successfully updated",
    },
  },

  fn: async function (inputs, exits) {
    console.log("trying to update user");
    const fullName = inputs.fullName;
    const bio = inputs.bio;

    // if there's no an avatar image to upload
    if (inputs.imageFile.isNoop) {
      await User.update({ id: this.req.me.id }).set({
        fullName: fullName,
        bio: bio,
      });

      inputs.imageFile.upload({ noop: true });
      return exits.success();
    }

    const fileUrl = await sails.helpers.uploadfile.with({
      file: inputs.imageFile,
    });

    const updatedUser = await User.update({ id: this.req.me.id })
      .set({
        fullName: fullName,
        bio: bio,
        profileImageUrl: fileUrl,
      })
      .fetch();

    sails.log.debug(JSON.parse(JSON.stringify(updatedUser)));
    return exits.success();
  },
};
