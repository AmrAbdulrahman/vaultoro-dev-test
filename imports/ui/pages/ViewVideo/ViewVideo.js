import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Videos from '../../../api/Videos/Videos';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import VideoPreviewer from '../../components/VideoPreviewer/VideoPreviewer';
import Rating from '../../components/Rating/Rating';

const handleRemove = (videoId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('videos.remove', videoId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Video deleted!', 'success');
        history.push('/videos');
      }
    });
  }
};

const renderVideo = (video, match, history) => (video ? (
  <div className="ViewVideo">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ video && video.title }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(video._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    <div>
      <label>Rating</label>: <Rating value={video.rating} />
    </div>
    <div>
      <label>Url</label>: {video && video.url}
    </div>
    <VideoPreviewer url={video ? video.url : ''} />
  </div>
) : <NotFound />);

const ViewVideo = ({ loading, video, match, history }) => (
  !loading ? renderVideo(video, match, history) : <Loading />
);

ViewVideo.propTypes = {
  loading: PropTypes.bool.isRequired,
  video: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const videoId = match.params._id;
  const subscription = Meteor.subscribe('videos.view', videoId);

  return {
    loading: !subscription.ready(),
    video: Videos.findOne(videoId),
  };
}, ViewVideo);
