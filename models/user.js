'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

let User = mongoose.model('User', userSchema);

module.exports = User;
