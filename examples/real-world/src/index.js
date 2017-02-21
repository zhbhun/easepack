import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.less';

const rootElement = document.getElementById('root');
let render = () => {
  const Root = require('./Root').default;
  ReactDOM.render(
    <Root />,
    rootElement
  );
}

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render;
  render = () => {
    try {
      renderApp();
    } catch (error) {
      console.error(error);
    }
  };
  const rerender = () => {
    setTimeout(render)
  };
  module.hot.accept('./Root', rerender);
}

render();
