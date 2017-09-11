import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import GIFs from '../../../api/GIFs/GIFs';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import GIFPreviewer from '../../components/GIFPreviewer/GIFPreviewer';

const handleRemove = (GIFId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('gifs.remove', GIFId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('GIF deleted!', 'success');
        history.push('/gifs');
      }
    });
  }
};

const renderGIF = (gif, match, history) => (gif ? (
  <div className="ViewGIF">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ gif && gif.title }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(gif._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    { gif && gif.url }
    <GIFPreviewer url={gif ? gif.url : ''} />
  </div>
) : <NotFound />);

const ViewGIF = ({ loading, gif, match, history }) => (
  !loading ? renderGIF(gif, match, history) : <Loading />
);

ViewGIF.propTypes = {
  loading: PropTypes.bool.isRequired,
  gif: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const GIFId = match.params._id;
  const subscription = Meteor.subscribe('gifs.view', GIFId);

  return {
    loading: !subscription.ready(),
    gif: GIFs.findOne(GIFId),
  };
}, ViewGIF);
