const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");
const port = process.env.PORT || 5000;

// DB SETUP
mongoose
  .connect("mongodb://localhost/melog", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((con) => console.log(`Connected To Database`))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`app is running on ${port} `);
});
