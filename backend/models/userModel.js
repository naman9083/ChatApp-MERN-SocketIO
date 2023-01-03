const mongoose = require("mongoose");
const schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: {
      type: String,
      required: true,
      default:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User",userSchema);
module.exports = User;