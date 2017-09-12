import React from 'react';
import PropTypes from 'prop-types';
import VideoEditor from '../../components/VideoEditor/VideoEditor';

const NewVideo = ({ history }) => (
  <div className="NewVideo">
    <h4 className="page-header">New Video</h4>
    <VideoEditor history={history} />
  </div>
);

NewVideo.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewVideo;
