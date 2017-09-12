import React from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';

const DEFAULT_URL_VALUE = '';

import './VideoPreviewer.scss';

class VideoPreviewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    setTimeout(() => this.loadVideo(props.url));
  }

  componentDidUpdate(props) {
    if (props.url !== this.props.url) {
      this.loadVideo(this.props.url);
    }

    if (this.props.paused) {
      this.pause();
    }
  }

  loadVideo(url) {
    this.setState({
      videoId: this.getVideoID(url),
    });
  }

  pause() {
    // pause the video of we already loaded and we have a reference
    this.videoReference && this.videoReference.pauseVideo();
  }

  // trim other query parameters like 'time=X'
  // sometimes, we have it as a second parameter '&t=123'
  // and sometimes, we have it as first param '?t=123'
  // @TODO this should get handled automatically by Google
  // to accept a videoUrl and not only an ID, check newer versions.
  trimYoutubeUrlParameters(url) {
    const ampersandPosition = url.indexOf('&');
    const questionMarkPosition = url.indexOf('?');

    if (ampersandPosition !== -1) {
      return url.substring(0, ampersandPosition);
    } else if (questionMarkPosition !== -1) {
      return url.substring(0, questionMarkPosition);
    }

    return url;
  }

  getVideoID(url) {
    try {
      const shortLinkBase = 'https://youtu.be/';
      const isShortLink = url.indexOf(shortLinkBase) !== -1;
      let videoId = null;

      if (isShortLink === true) {
        videoId = url.replace(shortLinkBase, '');
      } else {
        videoId = url.split('v=')[1];
      }

      return this.trimYoutubeUrlParameters(videoId);
    } catch (ex) {
      return false; // raises the error message
    }
  }

  onPlayerError() {
    this.setState({
      videoId: false,
    });
  }

  // hold a reference to the video so we can manually
  // pause it later
  onPlayerReady(event) {
    this.videoReference = event.target;

    // check if should be forced as paused.
    if (this.props.paused) {
      this.pause();
    }
  }

  // propagate onPlay event
  onPlayerPlay(event) {
    this.props.onPlay && this.props.onPlay(event);
  }

  render() {
    const cssClass = 'VideoPreviewer' + (this.props.inline ? ' inline' : '');

    return (
      <div className={cssClass}>
        {(() => {
          if (this.state.videoId === false) {
            return (
              <div>No preview available, url is invalid or missing.</div>
            );
          }

          return (
            <div>
              <YouTube
                videoId={this.state.videoId}
                onError={() => this.onPlayerError()}
                onReady={(event) => this.onPlayerReady(event)}
                onPlay={(event) => this.onPlayerPlay(event)} />
            </div>
          );
        })()}
      </div>
    );
  }
}

VideoPreviewer.defaultProps = {
  url: DEFAULT_URL_VALUE,
  inline: false,
  paused: false,
};

VideoPreviewer.propTypes = {
  url: PropTypes.string,
  inline: PropTypes.bool,
  paused: PropTypes.bool,
};

export default VideoPreviewer;
