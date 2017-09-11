import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import GIFs from '../GIFs';

Meteor.publish('gifs', function gifs() {
  return GIFs.find({ owner: this.userId });
});

Meteor.publish('gifs.view', function gifsView(GIFId) {
  check(GIFId, String);
  return GIFs.find({ _id: GIFId, owner: this.userId });
});
