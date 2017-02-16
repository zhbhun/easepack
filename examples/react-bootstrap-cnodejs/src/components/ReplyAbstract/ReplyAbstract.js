import React, { PropTypes, Component } from 'react';
import { ButtonToolbar, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

import ReplyContent from '../ReplyContent';

export default class ReplyAbstract extends Component {

  static contextTypes = {
    user: PropTypes.object,
  };

  static propTypes = {
    id: PropTypes.string,
    author: PropTypes.object,
    content: PropTypes.string,
    create_at: PropTypes.string,
    reply_id: PropTypes.string,
    ups: PropTypes.array,
    index: PropTypes.number,
    isFavorite: PropTypes.bool,
    onFavorite: PropTypes.func,
    onReply: PropTypes.func,
    onRemove: PropTypes.func,
  }

  handleFavorite = () => {
    const { id, onFavorite } = this.props;
    onFavorite && onFavorite(id);
  }

  handleReply = () => {
    const { id, onReply } = this.props;
    onReply && onReply(id);
  }

  handleRemove = () => {
    const { id, onRemove } = this.props;
    onRemove && onRemove(id);
  }

  renderAction() {
    const { user } = this.context;
    const { author, ups, isFavorite } = this.props;
    const isMyReply = user && author && user.loginname === author.loginname;
    const upsCount = (ups && ups.length) || 0;
    return (
      <ButtonToolbar>
        <ButtonGroup bsSize="xsmall">
          <Button
            bsStyle="link"
            onClick={this.handleFavorite}
          >
            <Glyphicon glyph={isFavorite ? 'heart' : 'heart-empty'} />
            <span>{upsCount > 0 ? ` ${upsCount} ` : ''}</span>
          </Button>
          {
            isMyReply && 0 ?
              <Button bsStyle="link"><Glyphicon glyph="edit" /></Button> :
              null
          }
          {
            isMyReply && 0 ?
              <Button
                bsStyle="link"
                onClick={this.handleRemove}
              >
                <Glyphicon glyph="trash" />
              </Button> :
              null
          }
          <Button
            bsStyle="link"
            onClick={this.handleReply}
          >
            <Glyphicon glyph="comment" />
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    );
  }

  render() {
    const { id, author, content, create_at, index } = this.props;
    const username = author.loginname;
    const userUrl = `/user/${username}`;
    const userAvtar = author.avatar_url;
    return (
      <div className="ReplyAbstract">
        <div className="author_content">
          <a
            className="user_avatar"
            href={userUrl}
          >
            <img
              src={userAvtar}
              title={username}
              alt={username}
            />
          </a>
          <div className="user_info">
            <a
              className="dark reply_author"
              href={userAvtar}
            >
              {username}
            </a>
            <a
              className="reply_time"
              href={`#${id}`}
            >
              {`${index}楼 • ${create_at.substring(0, 10)}`}
            </a>
          </div>
          <div className="user_action">
            {this.renderAction()}
          </div>
        </div>
        <ReplyContent html={content} />
      </div>
    );
  }
}
