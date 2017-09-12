/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
import GIFPreviewer from '../GIFPreviewer/GIFPreviewer';
import { get } from 'lodash';

class GIFEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: get(this.props, 'gif.url', ''),
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
          required: `What's a GIF without url? fill in a url, please. now.`,
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
    const existingGIF = this.props.gif && this.props.gif._id;
    const methodToCall = existingGIF ? 'gifs.update' : 'gifs.insert';
    const gif = {
      title: this.title.value.trim(),
      url: this.url.value.trim(),
      rating: this.getRatingValue(),
    };

    if (existingGIF) gif._id = existingGIF;

    Meteor.call(methodToCall, gif, (error, GIFId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingGIF ? 'GIF updated!' : 'GIF added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/gifs/${GIFId}`);
      }
    });
  }

  onUrlChange(event) {
    this.setState({
      url: event.target.value,
    });
  }

  render() {
    const { gif } = this.props;

    return (<form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
      <FormGroup>
        <ControlLabel>Title</ControlLabel>
        <input
          type="text"
          className="form-control"
          name="title"
          ref={title => (this.title = title)}
          defaultValue={gif && gif.title}
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
          defaultValue={gif && gif.url}
          placeholder="GIF URL... (try giphy.com)"
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
          defaultValue={gif && gif.rating}
          placeholder="GIF Rating... (0-5)"
        />
      </FormGroup>
      <GIFPreviewer url={this.state.url} />
      <Button type="submit" bsStyle="success">
        {gif && gif._id ? 'Save Changes' : 'Add GIF'}
      </Button>
    </form>);
  }
}

GIFEditor.defaultProps = {
  gif: { title: '', url: '', rating: 0 },
};

GIFEditor.propTypes = {
  gif: PropTypes.object,
  history: PropTypes.object.isRequired,
  rating: PropTypes.number,
};

export default GIFEditor;
