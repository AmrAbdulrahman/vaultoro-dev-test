import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Videos from '../../../api/Videos/Videos';
import VideoEditor from '../../components/VideoEditor/VideoEditor';
import NotFound from '../NotFound/NotFound';

const EditVideo = ({ video, history }) => (video ? (
  <div className="EditVideo">
    <h4 className="page-header">{`Editing "${video.title}"`}</h4>
    <VideoEditor video={video} history={history} />
  </div>
) : <NotFound />);

EditVideo.defaultProps = {
  video: null,
};

EditVideo.propTypes = {
  video: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const VideoId = match.params._id;
  const subscription = Meteor.subscribe('videos.view', VideoId);

  return {
    loading: !subscription.ready(),
    video: Videos.findOne(VideoId),
  };
}, EditVideo);
