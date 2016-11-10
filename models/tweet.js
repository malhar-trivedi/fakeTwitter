'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let tweetSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  message: String,
  image: String,
  href: String,
  userName: String,
  userId: {
    type: String,
    required: true,
  },
});

let Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
