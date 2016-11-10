'use strict';

const Promise = require('bluebird');
const User = require('./user');
const ONLY_ADD_ELEMENT = 'NX';
const redis = require('redis');
const log = require('bunyan').createLogger({
  name: 'writeTweetService',
  level: process.env.LOG_LEVEL,
});
const Tweet = require('../models/tweet');
const _ = require('lodash');

class writeTweet {
  constructor(redisClient) {
    this.userService = new User();
    this.redisClient = redisClient;
  }
  
  fanOut(options) {  
    let self = this;
    // call user service, get profile info like image, href, title, userID
    // say you update options object with that information
    options = _.defaults(options, {    //TODO replace this 
      image: 'http://placehold.it/64x64',
      href: '#',
      userName: 'nickName',
      userId: 'myset',
    });
    let newTweet = new Tweet(options);
    let timestamp, tweetId;

    return newTweet.save()
    .then((result) => {
      tweetId = result.id;
      timestamp = result.date.getTime();
      return self.userService.getUserFollowers(options.userId);
    })
    .then((followers) => {
      log.debug('received follwers for user ', options.userId);
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
