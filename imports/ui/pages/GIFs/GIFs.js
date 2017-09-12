import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import GIFsCollection from '../../../api/GIFs/GIFs';
import Loading from '../../components/Loading/Loading';
import GIFPreviewer from '../../components/GIFPreviewer/GIFPreviewer';

import './GIFs.scss';

const handleRemove = (GIFId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('gifs.remove', GIFId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('GIF deleted!', 'success');
      }
    });
  }
};

const GIFs = ({ loading, gifs, match, history }) => (!loading ? (
  <div className="GIFs">
    <div className="page-header clearfix">
      <h4 className="pull-left">GIFs</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add GIF</Link>
    </div>
    {gifs.length ? <Table responsive>
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
        {gifs.map(({ _id, title, url, rating, createdAt, updatedAt }) => (
          <tr key={_id}>
            <td>{title}</td>
            <td>{timeago(updatedAt)}</td>
            <td>{monthDayYearAtTime(createdAt)}</td>
            <td className='previewCol'>
              <GIFPreviewer url={url} />
            </td>
            <td>{rating || 'Not rated'}</td>
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
    </Table> : <Alert bsStyle="warning">No GIFs yet!</Alert>}
  </div>
) : <Loading />);

GIFs.propTypes = {
  loading: PropTypes.bool.isRequired,
  gifs: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('gifs');

  return {
    loading: !subscription.ready(),
    gifs: GIFsCollection.find().fetch(),
  };
}, GIFs);
