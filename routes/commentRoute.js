const express = require("express");
const {
  getAllComments,
  createComment,
} = require("../controller/commentController");
const { protectRoute } = require("../controller/authenticationController");

const router = express.Router();

router.route("/").get(getAllComments).post(protectRoute, createComment);

module.exports = router;
