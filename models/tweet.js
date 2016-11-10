'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let tweetSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    default: '#',
  },
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

let Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
