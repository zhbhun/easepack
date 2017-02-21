import classNames from 'classnames';
import React, { PropTypes, Component, isValidElement } from 'react';
import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';

const BODY_COL = {
  xs: 12,
  md: 8,
  lg: 9
};
const SIDEBAR_COL = {
  xsHidden: true,
  smHidden: true,
  md: 4,
  lg: 3,
};

export default class MainLayout extends Component {

  static propTypes = {
    className: PropTypes.string,
    sidebar: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.boolean,
    ]),
  };

  static defaultProps = {
    sidebar: false,
  };

  render() {
    const {
      className,
      sidebar,
      children,
      ...props,
    } = this.props;
    return (
      <Grid
        {...props}
        className={classNames(className, 'MainLayout')}
      >
        <Row className="show-grid">
          <Col {...(sidebar !== false ? BODY_COL : {})}>
            {children}
          </Col>
          {
            isValidElement(sidebar) ?
              <Col {...SIDEBAR_COL}>
                {sidebar}
              </Col> :
              null
          }
        </Row>
      </Grid>
    );
  }
}
