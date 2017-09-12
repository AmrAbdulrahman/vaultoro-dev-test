import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Videos from './Videos';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'videos.insert': function videoInsert(video) {
    check(video, {
      title: String,
      url: String,
      rating: Number
    });

    try {
      return Videos.insert({ owner: this.userId, ...video });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'videos.update': function videoUpdate(video) {
    check(video, {
      _id: String,
      title: String,
      url: String,
      rating: Number,
    });

    try {
      const videoId = video._id;
      Videos.update(videoId, { $set: video });
      return videoId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'videos.remove': function videoRemove(videoId) {
    check(videoId, String);

    try {
      return Videos.remove(videoId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'videos.insert',
    'videos.update',
    'videos.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
