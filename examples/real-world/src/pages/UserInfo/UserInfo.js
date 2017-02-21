import React, { PropTypes, Component } from 'react';
import {
  Panel,
  Breadcrumb,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import * as userServices from '../../services/userServices';

import ProgressWrapper from '../../components/ProgressWrapper';
import MainLayout from '../../components/MainLayout';
import Sidebar from '../../components/Sidebar';

export default class UserInfo extends Component {

  static contextTypes = {
    logon: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      user: null,
      recentTopics: null,
      recentReplies: null,
    };
  }

  componentWillMount() {
    this.loadUserInfo();
  }

  loadUserInfo = () => {
    this.setState({ loading: true, error: null });
    userServices.getUserInfo(this.props.params.loginname)
    .then(({ success, error_msg, data }) => {
      if (success) {
        const { recent_topics, recent_replies, ...user } = data;
        this.setState({
          loading: false,
          user,
          recentTopics: recent_topics,
          recentReplies: recent_replies,
        });
      } else {
        throw new Error(error_msg);
      }
    })
    .catch((error) => {
      this.setState({
        loading: false,
        error: error.message,
      });
    });
  }

  renderUserIntroduce = () => {
    const { user } = this.state;
    if (!user) {
      return null;
    }
    const { avatar_url, githubUsername, create_at, score } = user;
    const github = `https://github.com/${githubUsername}`;
    return (
      <Panel
        className="userinfo"
        header={
          <Breadcrumb>
            <LinkContainer
              onlyActiveOnIndex
              to="/"
            >
              <Breadcrumb.Item>
                <span>主页</span>
              </Breadcrumb.Item>
            </LinkContainer>
            <Breadcrumb.Item active>
              用户详情
                </Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <ul>
          <li>
            <img
              className="useravatar"
              src={avatar_url}
              alt="头像"
            />
          </li>
          <li>loginname</li>
          <li>{`${score} 积分`}</li>
          <li>
            <span>Github</span>
            <a href={github}>{`  ${githubUsername}`}</a></li>
          <li>
            <span>注册时间</span>
            <span>{`  ${create_at}`}</span>
          </li>
        </ul>
      </Panel>
    );
  }

  renderRecentTopics = () => {
    // const { recentTopics } = this.state;
    return (
      <Panel
        className="recenttopics"
        header="最近创建的话题"
      >
      </Panel>
    );
  }

  renderRecentReplies = () => {
    // const { recentReplies } = this.state;
    return (
      <Panel
        className="recentreplies"
        header="最近参与的话题"
      >
      </Panel>
    )
  }

  renderSidebar = () => {
    const { logon } = this.context;
    const { user } = this.state;
    return (
      <Sidebar
        userThumbnailTitle="个人信息"
        user={user}
        topicReleasable={logon}
        barcodeVisible
      />
    );
  }

  render = () => {
    const { loading, error } = this.state;
    return (
      <div id="UserInfo">
        <ProgressWrapper
          loading={loading}
          error={error}
        >
          <MainLayout
            sidebar={this.renderSidebar()}
          >
            {this.renderUserIntroduce()}
            {/*{this.renderRecentTopics()}*/}
            {/*{this.renderRecentReplies()}*/}
          </MainLayout>
        </ProgressWrapper>
      </div>
    );
  }
}

