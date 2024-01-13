const mongoose = require("mongoose");

const verifySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },

  {collection:"VerifyUser"},
  
  { timestamps: true }
);

module.exports = mongoose.model("VerifyUser", verifySchema);