import React from 'react';
import { Router, browserHistory } from 'react-router';

import routes from './routes';

if (!window.routes) {
  window.routes = routes;
}

const Root = () => {
  return (
    <Router
      history={browserHistory}
      routes={window.routes}
    />
  );
};

export default Root;
