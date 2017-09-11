import React from 'react';
import { Button } from 'react-bootstrap';
import { random } from 'lodash';
import giphsCollection from './giphs-collection';

import './Index.scss';

const randomGiph = () => {
  const randomIndex = random(0, giphsCollection.length - 1);
  return giphsCollection[randomIndex];
};

const Index = () => (
  <div className="Index">
    <div className="image-wrapper">
      <img
        className="funny-giph"
        src={randomGiph()}
        alt="Clever Beagle"
      />
    </div>
    <div className="image-wrapper">
      <img
        src="https://s3-us-west-2.amazonaws.com/cleverbeagle-assets/graphics/email-icon.png"
        alt="Clever Beagle"
      />
    </div>
    <h1>Pup</h1>
    <p>A boilerplate for products.</p>
    <div>
      <Button href="http://cleverbeagle.com/pup">Read the Docs</Button>
      <Button href="https://github.com/cleverbeagle/pup"><i className="fa fa-star" /> Star on GitHub</Button>
    </div>
    <footer>
      <p>Need help and want to stay accountable building your product? <a href="http://cleverbeagle.com?utm_source=pupappindex&utm_campaign=oss">Check out Clever Beagle</a>.</p>
    </footer>
  </div>
);

export default Index;
