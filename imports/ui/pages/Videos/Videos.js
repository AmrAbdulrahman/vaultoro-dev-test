import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import VideosCollection from '../../../api/Videos/Videos';
import Loading from '../../components/Loading/Loading';
import VideoPreviewer from '../../components/VideoPreviewer/VideoPreviewer';
import Rating from '../../components/Rating/Rating';

import './Videos.scss';

const handleRemove = (videoId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('videos.remove', videoId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Video deleted!', 'success');
      }
    });
  }
};

const Videos = ({ loading, videos, match, history }) => (!loading ? (
  <div className="Videos">
    <div className="page-header clearfix">
      <h4 className="pull-left">Videos</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Video</Link>
    </div>
    {videos.length ? <Table responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Last Updated</th>
          <th>Created</th>
          <th>Preview</th>
          <th>Rating</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {videos.map(({ _id, title, url, rating, createdAt, updatedAt }) => (
          <tr key={_id}>
            <td>{title}</td>
            <td>{timeago(updatedAt)}</td>
            <td>{monthDayYearAtTime(createdAt)}</td>
            <td className='previewCol'>
              <VideoPreviewer url={url} />
            </td>
            <td>
              <Rating value={rating} />
            </td>
            <td>
              <Button
                bsStyle="primary"
                onClick={() => history.push(`${match.url}/${_id}`)}
                block
              >View</Button>
            </td>
            <td>
              <Button
                bsStyle="danger"
                onClick={() => handleRemove(_id)}
                block
              >Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table> : <Alert bsStyle="warning">No Videos yet!</Alert>}
  </div>
) : <Loading />);

Videos.propTypes = {
  loading: PropTypes.bool.isRequired,
  videos: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('videos');

  return {
    loading: !subscription.ready(),
    videos: VideosCollection.find().fetch(),
  };
}, Videos);
