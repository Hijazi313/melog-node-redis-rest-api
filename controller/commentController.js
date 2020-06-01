const Comment = require("../models/commentsModel");

exports.getAllComments = async (req, res, next) => {
  const comments = await Comment.find();
  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  });
};
exports.createComment = async (req, res, next) => {
  const comment = await Comment.create(req.body);

  return res.status(201).json({
    status: "success",
    data: {
      comment,
    },
  });
};
