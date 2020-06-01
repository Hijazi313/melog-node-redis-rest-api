const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: [true, "Title Must be Unique"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Post Body is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    writer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post Writer is required"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.index({ writer: 1 });
// Virtual Populate
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

postSchema.pre("save", async function (next) {
  this.slug = await slugify(this.title, { lower: true, replacement: "_" });
  if (this.isModified("title")) {
    this.slug = await slugify(this.title, { lower: true, replacement: "_" });
    return next();
  }
  return next();
});

// QUERY MIDDLEWARES
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "writer",
    select: "-__v -password ",
  });

  next();
});
module.exports = Post = mongoose.model("Post", postSchema);
