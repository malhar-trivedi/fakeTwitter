'use strict';

const Promise = require('bluebird');
const log = require('bunyan').createLogger({
  name: 'userService',
  level: process.env.LOG_LEVEL,
});

class user {
  constructor() {
    // setup for this service
  }
  /**
   * Get all follower for given user
   * @returns Promise array of users
   */
  getUserFollowers(userId) {
    // TODO implement graph db for getting user information
    log.info('Need to implement graph db to get actual user data');
    let followers = [userId];
    return Promise.resolve(followers);
  }
}

module.exports = user;
