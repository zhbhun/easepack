import React from 'react';
import { Router, hashHistory } from 'react-router';

import routes from './routes';

const Root = () => (
  <Router history={hashHistory} routes={routes} />
)

export default Root;
