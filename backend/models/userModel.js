const mongoose = require("mongoose");
const schema = mongoose.Schema;
const model = mongoose.model;
const bcrypt = require('bcryptjs');

const userSchema = schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique:true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save',async function(next){
    if(!this.isModified){
      next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);

});

userSchema.methods.matchPassword= async function(enterPassword){
  return await bcrypt.compare(enterPassword,this.password);
}

const User = model("User",userSchema);
module.exports = User;