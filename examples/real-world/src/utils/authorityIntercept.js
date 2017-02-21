import React, { PropTypes, Component } from 'react';

export default function(WrappedComponent) {
  class AuthorityIntercept extends Component {
    static contextTypes = {
      logon: PropTypes.bool,
    };

    render = () => {
      const { logon } = this.context;
      if (!logon) {
        return (
          <div>
            forbidden!
          </div>
        );
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return AuthorityIntercept;
}
