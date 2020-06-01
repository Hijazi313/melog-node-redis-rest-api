const express = require("express");
const router = express.Router();
const { protectRoute } = require("../controller/authenticationController");

const {
  getPosts,
  createPost,
  getPost,
  updatePost,
} = require("../controller/postController");

router.route("/").get(getPosts).post(protectRoute, createPost);
router.route("/:slug").get(getPost).patch(updatePost);

module.exports = router;
