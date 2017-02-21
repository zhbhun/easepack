import React, { PropTypes, Component } from 'react';
import { ProgressBar, Alert } from 'react-bootstrap';

export default class ProgressWrapper extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    warning: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
      PropTypes.element,
    ]),
    error: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
      PropTypes.element,
    ]),
  };

  static defaultProps = {
    loading: false,
    warning: false,
    error: false,
  };

  renderLoading = () => {
    const { loading } = this.props;
    if (!loading) {
      return null;
    }
    return (
      <ProgressBar
        active
        bsStyle="info"
        label="加载中..."
        now={100}
        striped
      />
    );
  }

  renderWarning = () => {
    const { warning } = this.props;
    if (!warning) {
      return null;
    }
    return (
      <Alert bsStyle="warning">
        {warning}
      </Alert>
    )
  }

  renderError = () => {
    const { error } = this.props;
    if (!error) {
      return null;
    }
    return (
      <Alert bsStyle="danger">
        {error}
      </Alert>
    )
  }

  render() {
    const progress = this.renderLoading() || this.renderWarning() || this.renderError();
    return (
      <div className="ProgressWrapper">
        {progress ? progress : this.props.children}
      </div>
    );
  }
}
