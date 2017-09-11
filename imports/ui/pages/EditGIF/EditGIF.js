import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import GIFs from '../../../api/GIFs/GIFs';
import GIFEditor from '../../components/GIFEditor/GIFEditor';
import NotFound from '../NotFound/NotFound';

const EditGIF = ({ gif, history }) => (gif ? (
  <div className="EditGIF">
    <h4 className="page-header">{`Editing "${gif.title}"`}</h4>
    <GIFEditor gif={gif} history={history} />
  </div>
) : <NotFound />);

EditGIF.defaultProps = {
  gif: null,
};

EditGIF.propTypes = {
  gif: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const GIFId = match.params._id;
  const subscription = Meteor.subscribe('gifs.view', GIFId);

  return {
    loading: !subscription.ready(),
    gif: GIFs.findOne(GIFId),
  };
}, EditGIF);
