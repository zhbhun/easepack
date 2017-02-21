import React, {  PropTypes, Component } from 'react';
import { Link} from 'react-router';
import classNames from 'classnames';

export default class TopicAbstract extends Component {

  static propTypes = {
    id: PropTypes.string,
    tab: PropTypes.string,
    title: PropTypes.string,
    author_id: PropTypes.string,
    author: PropTypes.object,
    top: PropTypes.bool,
    good: PropTypes.bool,
    content: PropTypes.string,
    reply_count: PropTypes.number,
    visit_count: PropTypes.number,
    create_at: PropTypes.string,
    last_reply_at: PropTypes.string,
  }

  renderBadge() {
    const { top, good, tab } = this.props;
    let label = '';
    if (top) {
      label = '置顶';
    } else if (good) {
      label = '精华';
    } else {
      switch (tab) {
        case 'share':
          label = '分享';
          break;
        case 'ask':
          label = '问答';
          break;
        case 'job':
          label = '招聘';
          break;
        case 'good':
        default:
          label = '精华';
          break;
      }
    }
    return (
      <span
        className={classNames('topiclist-tab', {
          'put_top': top,
          'put_good': good,
        })}
      >
        {label}
      </span>
    );
  }

  render() {
    const {
      id,
      title,
      author: { avatar_url, loginname },
      reply_count,
      visit_count,
    } = this.props;

    return (
      <div className='TopicAbstract'>
        <Link
          className="user_avatar pull-left"
          to={`/user/${loginname}`}
        >
          <img
            src={avatar_url}
            title={loginname}
            alt={loginname}
          />
        </Link>
        <span className="reply_count pull-left">
          <span
            className="count_of_replies"
            title="回复数"
          >
            {reply_count}
          </span>
          <span className="count_seperator">/</span>
          <span
            className="count_of_visits"
            title='点击数'
          >
            {visit_count}
          </span>
        </span>
        <Link
          className="last_time pull-right"
          to={`/topic/${id}`}
        >
          <img
            className="user_small_avatar"
            src={avatar_url}
            alt={avatar_url}
          />
          <span className="last_active_time">3 小时前</span>
        </Link>
        <div className="topic_title_wrapper">
          {this.renderBadge()}
          <Link
            className='topic_title'
            to={`/topic/${id}`}
            title={title}
          >
            {title}
          </Link>
        </div>
      </div>
    );
  }
}
