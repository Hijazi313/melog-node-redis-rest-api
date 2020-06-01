const Post = require("../models/postModel");
const { clearHash } = require("../services/cache");
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comments").cache();
    res.status(200).json({
      status: 200,
      data: {
        posts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      errorMessage: err,
    });
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "comments"
    );
    res.status(200).json({
      status: 200,
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      errorMessage: err,
    });
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const post = new Post({ title, body, writer: req.user._id });
    if (!title || !body) {
      return res
        .status(400)
        .json({ errorMessage: "Post title and Body can't be Empty" });
    }

    await post.save();
    return res.status(201).json({
      message: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      errorMessage: err,
    });
  }

  // Clear  all hashes on creating new post
  clearHash();
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    await post.save();
    res.status(200).json({
      status: 200,
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      errorMessage: err,
    });
  }
};
