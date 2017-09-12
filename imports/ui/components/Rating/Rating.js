import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';
import { times } from 'lodash';

const DEFAULT_RATING_VALUE = 0;
const MAX_RATING_VALUE = 5;

import './Rating.scss';

class Rating extends React.Component {
  render() {
    const rating = this.props.value || DEFAULT_RATING_VALUE;

    return (
      <div className='Rating'>
        {
          times(MAX_RATING_VALUE, (index) => {
            const iconClass = index < rating ? 'star' : 'star-empty';

            return (
              <Glyphicon key={index} glyph={iconClass} />
            );
          })
        }
      </div>
    );
  }
}

Rating.defaultProps = {
  value: DEFAULT_RATING_VALUE,
};

Rating.propTypes = {
  value: PropTypes.number,
};

export default Rating;
