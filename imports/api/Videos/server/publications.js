import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Videos from '../Videos';

Meteor.publish('videos', function videos() {
  return Videos.find({ owner: this.userId });
});

Meteor.publish('videos.view', function videoView(videoId) {
  check(videoId, String);
  return Videos.find({ _id: videoId, owner: this.userId });
});
