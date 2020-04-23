import jsonFormat from 'json-format';
import classNames from 'classnames';
import styles from './Home.module.scss';

var JSON_CONFIG = {
  type: 'space',
  size: 2
};

var rootEle = document.querySelector('#root');
rootEle.innerHTML = /* html */ `
  <h1 class="${classNames(styles.title)}">
    Hello World
  </h1>
  <p class="${classNames(styles.paragraph)}">Hello World</p>
  <pre class=${styles.json}>${jsonFormat(styles, JSON_CONFIG)}</pre>
`;
