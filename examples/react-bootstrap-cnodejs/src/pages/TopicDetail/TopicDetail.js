import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import {
  Panel,
  Button,
  Glyphicon,
} from 'react-bootstrap';

import * as topicServices from '../../services/topicServices';
import * as replyServices from '../../services/replyServices';

import ProgressWrapper from '../../components/ProgressWrapper';
import MainLayout from '../../components/MainLayout';
import TopicContent from '../../components/TopicContent';
import Sidebar from '../../components/Sidebar';
import ReplyAbstract from '../../components/ReplyAbstract';
import Editor from '../../components/Editor';

/**
 * TODO
 *
 * 1. 主题加载失败重试
 * 2. 主题收藏失败提示
 */
export default class TopicDetail extends Component {

  static contextTypes = {
    logon: PropTypes.bool,
    user: PropTypes.object,
    accessToken: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      topic: null,
      collecting: false,
      repltTarget: undefined,
      replyReleasing: false,
    };
  }

  componentWillMount() {
    this.loadTopicDetail();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.id !== this.props.params.id) {
      this.loadTopicDetail();
    }
  }

  getReplyContent = () => {
    const { replyEditor } = this.refs;
    if (!replyEditor) {
      return '';
    }
    return {
      html: replyEditor.getHtmlText(),
      markdown: replyEditor.getMarkdownText(),
    };
  }

  findReplyById = (id) => {
    const { topic: { replies } } = this.state;
    let matchedIndex = -1;
    let matchedReply = null;
    replies.some((reply, index) => {
      if (reply.id === id) {
        matchedIndex = index;
        matchedReply = reply;
        return true;
      }
      return false;
    });
    return {
      index: matchedIndex,
      reply: matchedReply,
    };
  }

  loadTopicDetail = () => {
    const { accessToken } = this.context;
    this.setState({ loading: true, error: false });
    topicServices.getTopicById(accessToken, this.props.params.id)
    .then(({ success, error_msg, data }) => {
      if (success) {
        this.setState({
          loading: false,
          topic: data,
        });
      } else {
        throw new Error(error_msg || '未知错误');
      }
    })
    .catch((error) => {
      this.setState({ loading: false, error: error.message });
    });
  }

  handleCollectToggle = () => {
    const { accessToken } = this.context;
    const { topic: { id, is_collect } } = this.state;
    this.setState({ collecting: true });
    if (is_collect) {
      topicServices.deCollectTopic(accessToken, id)
      .then(({ success, error_msg }) => {
        if (success) {
          this.setState({
            collecting: false,
            topic: Object.assign({}, this.state.topic, { is_collect: false }),
          });
        } else {
          throw new Error(error_msg || '未知错误');
        }
      })
      .catch((error) => {
        this.setState({ collecting: false }); // TODO 警告提醒
      })
    } else {
      topicServices.collectTopic(accessToken, id)
      .then(({ success, error_msg }) => {
        if (success) {
          this.setState({
            collecting: false,
            topic: Object.assign({}, this.state.topic, { is_collect: true }),
          });
        } else {
          throw new Error(error_msg || '未知错误');
        }
      })
      .catch((error) => {
        this.setState({ collecting: false }); // TODO 警告提醒
      })
    }
  }

  handleReplyRelease = () => {
    const { topic, repltTarget,  replyReleasing } = this.state;
    if (replyReleasing) {
      return;
    }
    const { accessToken, user } = this.context;
    const { markdown, html } = this.getReplyContent();
    if (!markdown || !markdown.trim()) {
      return;
    }
    this.setState({ replyReleasing: true });
    replyServices.addReply(accessToken, topic.id, markdown, repltTarget)
    .then(({ success, error_msg, reply_id }) => {
      if (success) {
        this.setState({
          topic: Object.assign({}, topic, {
            replies: [...topic.replies, {
              author: user,
              content: html,
              create_at: new Date().toISOString(),
              id: reply_id,
              reply_id: repltTarget || null,
              ups: [],
            }],
          }),
          replyReleasing: false,
          repltTarget: undefined,
        });
      } else {
        throw new Error(error_msg || '未知错误');
      }
    })
    .catch((error) => {
      this.setState({ replyReleasing: false }); // TODO 警告提醒
    });
  }

  handleFavorite = (id) => {
    const { accessToken, logon, user } = this.context;
    if (!logon) {
      alert('请先登录！')
      return; // 警告提示
    }
    const userid = (user && user.id) || '';
    replyServices.favoriteReply(accessToken, id)
    .then(({ success, error_msg, action }) => {
      if (success) {
        const { topic: { replies } } = this.state;
        const {
          index: matchedIndex,
          reply: matchedReply,
        } = this.findReplyById(id);
        if (!matchedReply) {
          throw new Error('未知错误');
        }
        let newReply = matchedReply;
        const { ups } = matchedReply;
        const upsIndex = ups.indexOf(userid);
        if (action === 'up' && upsIndex < 0) {
          newReply = Object.assign({}, matchedReply, {
            ups: [...ups, userid],
          });
        } else if (action === 'down' && upsIndex >= 0) {
          newReply = Object.assign({}, matchedReply, {
            ups: ups.slice(0, upsIndex).concat(ups.slice(upsIndex + 1)),
          });
        }
        if (matchedReply !== newReply) {
          replies[matchedIndex] = newReply;
          this.setState(({
            topic: Object.assign({}, this.state.topic, {
              replies: [...replies],
            }),
          }));
        }
      } else {
        throw new Error(error_msg || '未知错误');
      }
    })
    .catch((error) => {
      console.log(error); // 警告提醒
    });
  }

  handleReplyReply = (id) => {
    const { logon } = this.context;
    if (!logon) {
      alert('请先登录');
      return; // 警告提示
    }
    const { reply } = this.findReplyById(id);
    if (!reply) {
      return;
    }
    this.refs.replyEditor && this.refs.replyEditor.setPlainText(`@${reply.author.loginname} `);
    this.setState({
      repltTarget: id,
    });
    this.scrollToReplyRelease();
  }

  handleClearReply = () => {
    this.refs.replyEditor && this.refs.replyEditor.clear();
    this.setState({
      repltTarget: null,
    });
  }

  scrollToReplyRelease = () => {
    const element = findDOMNode(this.refs.replyRelease);
    window.scrollTo(0, element.offsetTop);
  }

  scrollToReplyTarget = () => {
    const { repltTarget } = this.state;
    if (!repltTarget) {
      return;
    }
    const reply = this.findReplyById(repltTarget);
    if (reply) {
      const replyElement = document.querySelectorAll('#TopicDetail .ReplyAbstract')[reply.index];
      window.scrollTo(0, replyElement.offsetTop);
    }
  }

  renderTopic = () => {
    return (
      <Panel
        className="topic"
        header={this.renderTopicHeader()}
      >
        {this.renderTopicDetail()}
      </Panel>
    );
  }

  renderTopicHeader = () => {
    const { loading, topic, collecting } = this.state;
    if (loading || !topic) {
      return null;
    }
    const { logon } = this.context;
    const { title, create_at, author, visit_count, tab, is_collect } = topic;
    let collectBtnLabel = '';
    if (is_collect) {
      collectBtnLabel = collecting ? '取消收藏中...' : '取消收藏';
    } else {
      collectBtnLabel = collecting ? '收藏中...' : '收藏';
    }
    return (
      <div>
        {
          logon ?
            <div className="pull-right">
              <Button
                bsStyle={is_collect ? 'default' : 'primary' }
                disabled={collecting}
                onClick={this.handleCollectToggle}
              >
                {collectBtnLabel}
              </Button>
            </div> :
            null
        }
        <h1 className="topic-header">
          <p>{title}</p>
          <p className="topic-changes">
            <small>
              <span>{`发布于 ${create_at.substring(0, 10)}`}</span>
              <span>{`作者 ${author.loginname}`}</span>
              <span>{`${visit_count} 次浏览`}</span>
              <span>{`来自 ${tab}`}</span>
            </small>
          </p>
        </h1>
      </div>
    );
  }

  renderTopicDetail = () => {
    const { loading, topic } = this.state;
    if (loading || !topic) {
      return (
        <div>
          loading...
        </div>
      );
    }
    return (
      <TopicContent html={topic.content} />
    );
  }

  renderReplies = () => {
    return (
      <Panel
        className="replies"
        header={this.renderRepliesHeader()}
      >
        {this.renderRepliesList()}
      </Panel>
    );
  }

  renderRepliesHeader = () => {
    const { loading, topic } = this.state;
    if (loading || !topic || !topic.replies) {
      return null;
    }
    return (
      <div>
        {`${topic.replies.length} 回复`}
      </div>
    );
  }

  renderRepliesList = () => {
    const { user } = this.context;
    const { loading, topic } = this.state;
    if (loading || !topic || !topic.replies) {
      return null;
    }
    const id = (user && user.id) || '';
    return (
      <div>
        {
          topic.replies.map((reply, index) => (
            <ReplyAbstract
              {...reply}
              index={index + 1}
              key={reply.id}
              isFavorite={reply.ups && reply.ups.indexOf(id) >= 0}
              onFavorite={this.handleFavorite}
              onReply={this.handleReplyReply}
            />
          ))
        }
      </div>
    );
  }

  renderReplyRealese = () => {
    const { repltTarget, replyReleasing } = this.state;
    const reply = repltTarget ? this.findReplyById(repltTarget) : null;
    return (
      <Panel
        ref="replyRelease"
        header={
          reply ?
            <div>
              <Button
                className="pull-right"
                bsStyle="link"
                onClick={this.handleClearReply}
              >
                <Glyphicon glyph="remove" />
              </Button>
              <Button
                bsStyle="link"
                onClick={this.scrollToReplyTarget}
              >
                {`回复 ${reply.index + 1} 楼 `}
              </Button>
            </div>
            : '添加回复'
        }
      >
        <Editor ref="replyEditor" />
        <Button
          bsStyle="primary"
          disabled={replyReleasing}
          onClick={this.handleReplyRelease}
        >
          {replyReleasing ? '回复中...' : '回复'}
        </Button>
      </Panel>
    );
  }

  renderSidebar() {
    const { topic } = this.state;
    if (!topic) {
      return null;
    }
    return (
      <Sidebar
        userThumbnailTitle="作者"
        user={topic.author}
      />
    );
  }

  render = () => {
    const { logon } = this.context;
    const { loading, error, topic } = this.state;
    const topicLoaded = !loading && topic;
    const replyReleaseVisible = logon && !loading && !error && topic;
    return (
      <ProgressWrapper
        loading={loading}
        error={error}
      >
        <MainLayout
          id="TopicDetail"
          sidebar={this.renderSidebar()}
        >
          {this.renderTopic()}
          {topicLoaded ? this.renderReplies() : null}
          {replyReleaseVisible ? this.renderReplyRealese() : null}
        </MainLayout>
      </ProgressWrapper>
    );
  }
}
