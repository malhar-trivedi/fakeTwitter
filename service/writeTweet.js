'use strict';

const Promise = require('bluebird');
const User = require('./user');
const ONLY_ADD_ELEMENT = 'NX';
const redis = require('redis');
const log = require('bunyan').createLogger({
  name: 'writeTweetService',
  level: process.env.LOG_LEVEL,
});

class writeTweet {
  constructor(redisClient) {
    this.userService = new User();
    this.redisClient = redisClient;
  }
  
  fanOut(userId, tweetId, timestamp) {
    let self = this;

    return this.userService.getUserFollowers(userId)
    .then((followers) => {
      log.debug('received follwers for user ', userId);
      if(followers.length < 1){
        return Promise.resolve();
      }
      let promises = followers.map((follwer) => {
        // add tweets to user sorted set which are in cache.
        let args = [follwer, ONLY_ADD_ELEMENT, timestamp, tweetId];
        return self.redisClient.zaddAsync(args);
      });
      return Promise.all(promises);
    });
  }
}

module.exports = writeTweet;