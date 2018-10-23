import React from 'react'
import { hot } from 'react-hot-loader'

const App = () => (
  <div>
    <h1>react-hot-loader</h1>
    <input type="text"/>
  </div>
);

export default hot(module)(App);
