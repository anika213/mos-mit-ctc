const mongoose = require("mongoose");

const { Schema, model, Types } = mongoose;


const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  challenges: {
    type: Map,
    of: Number,
    default: {},
  },
  startTimes: {
    type: Map,
    of: Date,
    default: {},
  },
});

module.exports = mongoose.model("users", schema);
