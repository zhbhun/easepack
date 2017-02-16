import React, { PropTypes, Component } from 'react';
import { Panel, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

class UserThumbnail extends Component {

  static propTypes = {
    title: PropTypes.string,
    user: PropTypes.object,
  };

  renderUserThumbnail = () => {
    const { title, user: { loginname, avatar_url } } = this.props;
    return (
      <Panel
        className="UserThumbnail"
        header={title}
      >
        <p>
          <Link to={`/user/${loginname}`}>
            <Image
              className="user-avatar"
              responsive
              rounded
              src={avatar_url}
              alt={loginname}
            />
            <span className="user-name">{loginname}</span>
          </Link>
        </p>
        <p>积分：5</p>
        <p className="signature">“ 这家伙很懒，什么个性签名都没有留下。 ”</p>
      </Panel>
    );
  }

  render = () => {
    const { user } = this.props;
    if (user) {
      return this.renderUserThumbnail();
    }
    return (
      <Panel>
        <p>CNode：Node.js专业中文社区</p>
        <p>
          您可以选择登录, 以获取更好的体验
        </p>
        <LinkContainer to="signin">
          <Button bsStyle="info">立即登录</Button>
        </LinkContainer>
      </Panel>
    );
  }
}

export default UserThumbnail;
