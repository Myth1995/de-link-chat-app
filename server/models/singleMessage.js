const mongoose = require("mongoose");

const singleMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const SingleMessage = mongoose.model("SingleMessage", singleMessageSchema);
module.exports = SingleMessage;
