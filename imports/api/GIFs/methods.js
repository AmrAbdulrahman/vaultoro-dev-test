import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import GIFs from './GIFs';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'gifs.insert': function gifsInsert(gif) {
    check(gif, {
      title: String,
      url: String,
    });

    try {
      return GIFs.insert({ owner: this.userId, ...gif });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'gifs.update': function gifsUpdate(gif) {
    check(gif, {
      _id: String,
      title: String,
      url: String,
    });

    try {
      const GIFId = gif._id;
      GIFs.update(GIFId, { $set: gif });
      return GIFId;
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'gifs.remove': function gifsRemove(GIFId) {
    check(GIFId, String);

    try {
      return GIFs.remove(GIFId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'gifs.insert',
    'gifs.update',
    'gifs.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
