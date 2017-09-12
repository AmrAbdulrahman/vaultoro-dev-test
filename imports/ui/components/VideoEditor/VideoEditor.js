/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import VideoPreviewer from '../VideoPreviewer/VideoPreviewer';
import { get } from 'lodash';

class Video extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: get(this.props, 'video.url', ''),
    };
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        url: {
          required: true,
          url: true,
        },
        rating: {
          number: true,
          min: 0,
          max: 5,
        }
      },
      messages: {
        title: {
          required: 'Need a title in here, Seuss.',
        },
        url: {
          required: 'Video URL please.',
          url: 'Must be a valid URL.'
        },
        rating: {
          number: 'Rating must be a number',
          min: 'Minimum rating value is 0',
          max: 'Maximum rating value is 5',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  getRatingValue() {
    const intValue = parseInt(this.rating.value, 10);

    if (isNaN(intValue) === true) {
      return 0;
    }

    return intValue;
  }

  handleSubmit() {
    const { history } = this.props;
    const existingVideo = this.props.video && this.props.video._id;
    const methodToCall = existingVideo ? 'videos.update' : 'videos.insert';
    const video = {
      title: this.title.value.trim(),
      url: this.url.value.trim(),
      rating: this.getRatingValue(),
    };

    if (existingVideo) video._id = existingVideo;

    Meteor.call(methodToCall, video, (error, videoId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingVideo ? 'Video updated!' : 'Video added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/videos/${videoId}`);
      }
    });
  }

  onUrlChange(event) {
    this.setState({
      url: event.target.value,
    });
  }

  render() {
    const { video } = this.props;

    return (<form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
      <FormGroup>
        <ControlLabel>Title</ControlLabel>
        <input
          type="text"
          className="form-control"
          name="title"
          ref={title => (this.title = title)}
          defaultValue={video && video.title}
          placeholder="Oh, The Places You'll Go!"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Url</ControlLabel>
        <input
          type="text"
          className="form-control"
          name="url"
          ref={url => (this.url = url)}
          defaultValue={video && video.url}
          placeholder="Video URL..."
          onChange={(e) => this.onUrlChange(e)}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Rating</ControlLabel>
        <input
          type="text"
          className="form-control"
          name="rating"
          ref={rating => (this.rating = rating)}
          defaultValue={video && video.rating}
          placeholder="Video Rating... (0-5)"
        />
      </FormGroup>
      <VideoPreviewer url={this.state.url} />
      <Button type="submit" bsStyle="success">
        {video && video._id ? 'Save Changes' : 'Add Video'}
      </Button>
    </form>);
  }
}

Video.defaultProps = {
  video: { title: '', url: '', rating: 0 },
};

Video.propTypes = {
  video: PropTypes.object,
  history: PropTypes.object.isRequired,
  rating: PropTypes.number,
};

export default Video;
