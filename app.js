const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");

require("./services/cache");

const app = express();

// APP SETUP
app.use(morgan("combined"));
app.use(cors());

app.use(express.json({ type: "*/*" }));
app.use(express.static(`${__dirname}/public`));

app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: "Fail",
    message: `Cant't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
