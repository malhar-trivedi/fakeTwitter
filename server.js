'use strict';

const LAST_TWEETS = 50;
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = promise;
const _ = require('lodash');
const redis = require('redis');
const log = require('bunyan').createLogger({
  name: 'server',
  level: process.env.LOG_LEVEL,
});
promise.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient(process.env.REDIS_URL);

// data models
const Tweet = require('./models/tweet');
// services
const WriteService = require('./service/writeTweet');
const writeService = new WriteService(redisClient);

const app = express();                        // initialize express setup
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  log.info('connected to mongodb');
  // Initialize the app.
  let server = app.listen(process.env.PORT || 8080, function() {
    let port = server.address().port;
    log.info('App now running on port', port);
  });
})
.catch((e) => {
  log.error(e);
  process.exit(1);
});


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  log.error('ERROR: ' + reason);
  res.status(code || 500).json({'error': message});
}

app.get('/tweets', function(req, res) {
  // TODO get user info from cookie, console.log('Cookies: ', req.cookies)
  let userId = 'myset';

  getLatestTweetsFromCache(userId)
  .then((tweetIds) => {
    return Tweet.find(
      {_id: {'$in': tweetIds}},
      {'_id': 0,  '__v': 0}
    ).limit(LAST_TWEETS).sort({date: -1}).exec();
  })
  .then((result) => {
    res.status(200).json(result);
  })
  .catch((err) => {
    handleError(res, err.message, 'could not fetch data', 500);
  });
});

app.get('/tweets/:timestamp', function(req, res) {
  // TODO get user information from cookie,console.log('Cookies:',req.cookies)
  let beginTime = _.parseInt(req.params.timestamp);
  let endTime = Date.now();
  if(!_.isFinite(beginTime)) {
    handleError(res, 'Invalid timestamp', 'Invalid timestamp', 400);
  }

  // beginTime = '1473472501';
  // endTime = '1478742902';
  let userId = 'myset';

  getTweetsFromCacheByTimeRange(userId, beginTime, endTime)
  .then((tweetIds) => {
    return Tweet.find(
      {_id: {'$in': tweetIds}},
      {'_id': 0, '__v': 0}
    ).sort({date: -1}).exec();
  })
  .then((result) => {
    res.status(200).json(result);
  })
  .catch((err) => {
    handleError(res, err.message, 'could not fetch data', 500);
  });
});

function getTweetsFromCacheByTimeRange(userId, beginTime, endTime) {
  let args = [userId, endTime, beginTime];
  return redisClient.zrevrangebyscoreAsync(args);
}

function getLatestTweetsFromCache(userId) {
  let args = [userId, -LAST_TWEETS, -1];
  // TODO If below query returns empty results, means user not in cache
  // You need to call service that will create timeline for this user,
  // push it to cache and return result.
  return redisClient.zrevrangeAsync(args);
}

app.post('/tweet', function(req, res) {
  // TODO get user info from cookie, console.log('Cookies: ', req.cookies)
  let payload = req.body;
  // let userId = 'myset';  // TODO get this from cookie and put in payload
  if(!payload.message) {
    handleError(res, 'Invalid message', 'Invalid response', 400);
  }  

  res.status(201).json({status: 'ok'});

  writeService.fanOut(payload)
  .catch((err) => {
    log.error(err.message);
  });
});
