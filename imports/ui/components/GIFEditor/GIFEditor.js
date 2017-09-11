/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class GIFEditor extends React.Component {
  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        body: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'Need a title in here, Seuss.',
        },
        body: {
          required: 'This thneeds a body, please.',
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
      body: this.body.value.trim(),
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
        <ControlLabel>Body</ControlLabel>
        <textarea
          className="form-control"
          name="body"
          ref={body => (this.body = body)}
          defaultValue={gif && gif.body}
          placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
        />
      </FormGroup>
      <Button type="submit" bsStyle="success">
        {gif && gif._id ? 'Save Changes' : 'Add GIF'}
      </Button>
    </form>);
  }
}

GIFEditor.defaultProps = {
  gif: { title: '', body: '' },
};

GIFEditor.propTypes = {
  gif: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default GIFEditor;
