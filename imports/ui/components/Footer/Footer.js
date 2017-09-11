import React from 'react';
import { monthDayYear } from '@cleverbeagle/dates';
import { Link } from 'react-router-dom';
import { Grid } from 'react-bootstrap';

import './Footer.scss';

const currentDate = () => monthDayYear();

const Footer = () => (
  <div className="Footer">
    <Grid>
      <p className="pull-left">Amr Abdullah | {currentDate()}</p>
      <ul className="pull-right">
        <li><Link to="/terms">Terms<span className="hidden-xs"> of Service</span></Link></li>
        <li><Link to="/privacy">Privacy<span className="hidden-xs"> Policy</span></Link></li>
      </ul>
    </Grid>
  </div>
);

Footer.propTypes = {};

export default Footer;
