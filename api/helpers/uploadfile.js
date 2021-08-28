module.exports = {
  friendlyName: "Upload a image file",

  description: "Upload a image file in amazon s3",

  inputs: {
    file: {
      description: "image avatar",
      example: "===",
      type: "ref",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    console.log("this is my helper");
    const file = inputs.file;

    const key = process.env.AWS_KEY;
    const secret = process.env.AWS_SECRET;

    const options = {
      adapter: require("skipper-better-s3"),
      key: key,
      secret: secret,
      bucket: "rocket-social-app",
      s3params: { ACL: "public-read" },
      onProgress: (progress) => sails.log.verbose("Upload progress:", progress),
    };

    file.upload(options, async (err, files) => {
      if (err) {
        return this.res.serverError("Error skipper better: " + err.toString());
      }

      const fileUrl = files[0].extra.Location;

      return exits.success(fileUrl);
    });
  },
};
