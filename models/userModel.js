const mongoose = require("mongoose");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// Define Model
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "User name is Required"],
  },
  slug: {
    type: String,
    required: [true, "User Slug is Required"],
  },
  email: {
    type: String,
    unique: [true, "Email must be unique"],
    required: [true, "Password is Required"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password Required"],
  },
});

// On Save Hook for Hashing password
userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.pre("save", async function (next) {
  this.slug = await slugify(this.name, { lower: true, replacement: "_" });

  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPass
) {
  return await bcrypt.compare(candidatePassword, userPass);
};
// Create User Model Class
const model = mongoose.model("User", userSchema);

// Export model
module.exports = model;
