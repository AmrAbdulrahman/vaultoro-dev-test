import React from 'react';
import PropTypes from 'prop-types';
import GIFEditor from '../../components/GIFEditor/GIFEditor';

const NewGIF = ({ history }) => (
  <div className="NewGIF">
    <h4 className="page-header">New GIF</h4>
    <GIFEditor history={history} />
  </div>
);

NewGIF.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewGIF;
