const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment Can not be Empty"],
    },
    careatedAt: {
      type: Date,
      default: Date.now,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Comment Must belong to a Post."],
    },
    writer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Comment Must belong to a User."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// QUERY MIDDLEWARE
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "writer",
    select: "name",
  });
  next();
});
module.exports = Comment = mongoose.model("Comment", commentSchema);
