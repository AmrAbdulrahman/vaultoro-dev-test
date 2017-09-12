import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_URL_VALUE = '';

import './VideoPreviewer.scss';

class VideoPreviewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: props.url,
      error: false,
    };
  }

  onLoadingError(err) {
    this.setState({
      error: true,
    });
  }

  componentDidUpdate(props) {
    if (props.url !== this.props.url) {
      this.setState({
        error: false,
        url: this.props.url,
      });
    }
  }

  render() {
    return (
      <div className='VideoPreviewer'>
        {(() => {
          if (this.state.url === DEFAULT_URL_VALUE) {
            return (
              <div>No url set.</div>
            );
          }

          if (this.state.error === true) {
            return (
              <div>No preview available, invalid url.</div>
            );
          }

          return (
            <div>
              <img src={this.state.url} onError={(err) => this.onLoadingError(err)}/>
            </div>
          );
        })()}
      </div>
    );
  }
}

VideoPreviewer.defaultProps = {
  url: DEFAULT_URL_VALUE,
};

VideoPreviewer.propTypes = {
  url: PropTypes.string,
};

export default VideoPreviewer;
