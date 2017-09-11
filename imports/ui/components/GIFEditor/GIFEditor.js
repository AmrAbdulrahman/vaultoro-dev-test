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
          url: true
        },
      },
      messages: {
        title: {
          required: 'Need a title in here, Seuss.',
        },
        url: {
          required: `What's a GIF without url? fill in a url, please. now.`,
          url: 'Must be a valid URL.'
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingGIF = this.props.gif && this.props.gif._id;
    const methodToCall = existingGIF ? 'gifs.update' : 'gifs.insert';
    const gif = {
      title: this.title.value.trim(),
      url: this.url.value.trim(),
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
      <GIFPreviewer url={this.state.url} />
      <Button type="submit" bsStyle="success">
        {gif && gif._id ? 'Save Changes' : 'Add GIF'}
      </Button>
    </form>);
  }
}

GIFEditor.defaultProps = {
  gif: { title: '', url: '' },
};

GIFEditor.propTypes = {
  gif: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default GIFEditor;
