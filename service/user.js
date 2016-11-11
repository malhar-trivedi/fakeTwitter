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
    
    let cache = {
      myUserId: ['myUserId'],
      followingUserId: ['followingUserId', 'myUserId']
    };
    return Promise.resolve(cache[userId]);
  }
  
  getUserInfo(userId) {
    // TODO replace this with graph DB
    let cache = {
      myUserId: {
        image: 'https://s3.amazonaws.com/trimal.personal/frog64x64.jpg',
        href: '#',
        userName: 'Malhar',
        userId: 'myUserId',
      },
      followingUserId: {
        image: 'https://s3.amazonaws.com/trimal.personal/butterfly64x64',
        href: '#',
        userName: 'Nick',
        userId: 'followingUserId',
      }
    };
    return Promise.resolve(cache[userId]);
  }
}

module.exports = user;
