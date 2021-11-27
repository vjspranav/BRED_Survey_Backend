const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * User schema
 * proffesion: string
 * age : number
 * time_taken: number
 * Answers: []
 */
const userSchema = new Schema({
  profession: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  time_taken: {
    type: Number,
  },
  answers: {
    type: Object,
  },
  gender: {
    type: Number,
    min: 0,
    max: 2,
  },
  content_type: {
    type: Number,
    min: 0,
    max: 3,
  },
});

module.exports = User = mongoose.model("User", userSchema);
