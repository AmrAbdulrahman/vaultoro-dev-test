import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { set, startsWith } from 'lodash';
import Videos from '../Videos';
import EncryptionHelper from '../../../modules/encryption-helper';

const decodeVideoUrl = (video) => {
  // if encoded
  if (startsWith(video.url, 'http') === false) {
    set(video, 'url', EncryptionHelper.decrypt(video.url));
  }

  return video;
};

Meteor.publishTransformed('videos', function videos() {
  return Videos
    .find({ owner: this.userId })
    .serverTransform(decodeVideoUrl);
});

Meteor.publishTransformed('videos.view', function videoView(videoId) {
  check(videoId, String);

  return Videos
    .find({ _id: videoId, owner: this.userId })
    .serverTransform(decodeVideoUrl);
});
