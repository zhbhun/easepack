import React, { PropTypes, Component } from 'react';
import {
  Panel,
  Nav,
  NavItem,
  Pager,
} from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

import * as topicServices from '../../services/topicServices';

import ProgressWrapper from '../../components/ProgressWrapper';
import MainLayout from '../../components/MainLayout';
import TopicAbstract from '../../components/TopicAbstract';
import Sidebar from '../../components/Sidebar';

/**
 * TODO
 *
 * 1. 初始化失败，重试处理
 * 2. 分页加载失败，重试处理
 */
export default class TopicList extends Component {

  static contextTypes = {
    logon: PropTypes.bool,
    user: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      initiated: false,
      loading: false,
      error: false,
      topics: [],
    };
  }

  componentWillMount() {
    this.loadTopics();
  }

  componentDidUpdate(prevProps, prevState) {
    const previousTab = prevProps.location.query.tab || 'all';
    const currentTab = this.getCurrentTab();
    const previousPage = Number(prevProps.location.query.page || 1);
    const currentPage = this.getCurrentPage();
    if (currentTab !== previousTab) {
      this.setState({ initiated: false });
    }
    if (previousTab !== currentTab || previousPage !== currentPage) {
      this.loadTopics();
    }
  }

  getCurrentTab = () => {
    return this.props.location.query.tab || 'all';
  }

  getCurrentPage = () => {
    return Number(this.props.location.query.page || 1);
  }

  loadTopics() {
    const currentTab = this.getCurrentTab();
    const currentPage = this.getCurrentPage();
    this.setState({ loading: true, error: false });
    topicServices.getTopics(currentTab, currentPage, 30)
    .then(({ success, error_msg, data }) => {
      if (success) {
        this.setState({
          initiated: true,
          loading: false,
          topics: data,
        });
      } else {
        throw new Error(error_msg || '未知错误');
      }
    })
    .catch((error) => {
      this.setState({ loading: false, error: error.message });
    });
  }

  renderTopicTab() {
    return (
      <Nav bsStyle="pills">
        <IndexLinkContainer to={{ pathname: '/', query: { tab: 'all' } }} >
          <NavItem>全部</NavItem>
        </IndexLinkContainer>
        <LinkContainer to={{ pathname: '/', query: { tab: 'good' } }}>
          <NavItem>精华</NavItem>
        </LinkContainer>
        <LinkContainer to={{ pathname: '/', query: { tab: 'share' } }}>
          <NavItem>分享</NavItem>
        </LinkContainer>
        <LinkContainer to={{ pathname: '/', query: { tab: 'ask' } }}>
          <NavItem>问答</NavItem>
        </LinkContainer>
        <LinkContainer to={{ pathname: '/', query: { tab: 'job' } }}>
          <NavItem>招聘</NavItem>
        </LinkContainer>
      </Nav>
    );
  }

  renderTopicList() {
    const { location } = this.props;
    const { initiated, loading, error, topics } = this.state;
    const progressing = loading && !initiated;
    const query = location.query || {};
    const page = this.getCurrentPage();
    const hasPrevious = page > 1;
    const previousPage = hasPrevious ? page - 1 : 1;
    const hasMore = topics && topics.length > 0;
    const nextPage = hasMore ? page + 1 : page;
    return (
      <ProgressWrapper
        loading={progressing}
        error={error}
      >
        {
          hasMore ?
            topics.map((topic) => (
              <TopicAbstract key={topic.id} {...topic } />
            )) :
            <div>没有更多数据...</div>
        }
        <ProgressWrapper
          loading={loading}
          error={error}
        >
          <Pager>
            <IndexLinkContainer
              to={{
                pathname: '/',
                query: Object.assign({}, query, { page: previousPage }),
              }}
            >
              <Pager.Item disabled={!hasPrevious}>上一页</Pager.Item>
            </IndexLinkContainer>
            {' '}
            <IndexLinkContainer
              to={{
                pathname: '/',
                query: Object.assign({}, query, { page: nextPage }),
              }}
            >
              <Pager.Item disabled={!hasMore}>下一页</Pager.Item>
            </IndexLinkContainer>
          </Pager>
        </ProgressWrapper>
      </ProgressWrapper>
    )
  }

  renderSidebar = () => {
    const { logon, user } = this.context;
    return (
      <Sidebar
        userThumbnailTitle="个人信息"
        user={user}
        topicReleasable={logon}
        barcodeVisible
      />
    );
  }

  render() {
    return (
      <MainLayout
        id="TopicList"
        sidebar={this.renderSidebar()}
      >
        <Panel header={this.renderTopicTab()}>
          {this.renderTopicList()}
        </Panel>
      </MainLayout>
    );
  }
}
