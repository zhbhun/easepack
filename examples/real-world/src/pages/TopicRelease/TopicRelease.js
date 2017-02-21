import React, { PropTypes, Component } from 'react';
import {
  Panel,
  Breadcrumb,
  Form,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import * as topicServices from '../../services/topicServices';

import authorityIntercept from '../../utils/authorityIntercept';

import MainLayout from '../../components/MainLayout';
import Editor from '../../components/Editor';

/**
 * TODO
 *
 * 1. 发布话题失败提醒
 */
class TopicRelease extends Component {

  static contextTypes = {
    logon: PropTypes.bool,
    accessToken: PropTypes.string,
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      tab: '',
      title: '',
      submitting: false,
    };
  }

  getContent = () => {
    const { editor } = this.refs;
    if (!editor) {
      return '';
    }
    return editor.getMarkdownText();
  }

  handleFieldChange = ({ nativeEvent: { target }}) => {
    this.setState({
      [target.name]: target.value,
    });
  }

  handleRelease = () => {
    const { tab, title } = this.state;
    if (!tab) {
      return;
    }
    if (!title || title.length < 10) {
      return;
    }
    const { accessToken } = this.context;
    const content = this.getContent();
    if (!content || !content.trim()) {
      return;
    }
    this.setState({ submitting: true });
    topicServices.addTopic(accessToken, tab, title, content)
    .then(({ success, error_msg, topic_id }) => {
      if (success) {
        this.context.router.replace(`/topic/${topic_id}`);
      } else {
        throw new Error(error_msg || '未知错误');
      }
    })
    .catch((error) => {
      this.setState({ submitting: false }); // TODO 警告提醒
    });
  }

  renderSidebar = () => {
    return (
      <div>
        <Panel header="关于">
          <p>### 单行的标题</p>
          <p>**粗体**</p>
          <p>`console.log('行内代码')`</p>
          <p>```js\n code \n``` 标记代码块</p>
          <p>[内容](链接)</p>
          <p>![文字说明](图片链接)</p>
          <p>
            <a href="https://segmentfault.com/markdown">Markdown 文档</a>
          </p>
        </Panel>
        <Panel header="话题发布指南">
          <p>尽量把话题要点浓缩到标题里</p>
          <p>
            <span>代码含义和报错可在</span>
            <a href="http://segmentfault.com/t/node.js">SegmentFault</a>
            <span>提问</span>
          </p>
        </Panel>
      </div>
    );
  }

  render() {
    const { submitting } = this.state;
    return (
      <MainLayout
        className="TopicRelease"
        sidebar={this.renderSidebar()}
      >
        <Panel header={
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
              发布话题
            </Breadcrumb.Item>
          </Breadcrumb>
        }>
          <Form>
            <FormGroup>
              <FormControl
                componentClass="select"
                name="tab"
                onChange={this.handleFieldChange}
              >
                <option value="">请选择板块</option>
                <option value="share">分享</option>
                <option value="ask">问答</option>
                <option value="job">招聘</option>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl
                type="text"
                name="title"
                onChange={this.handleFieldChange}
                placeholder="标题字数 10 字以上"
              />
            </FormGroup>
            <FormGroup>
              <Editor ref="editor" />
            </FormGroup>
            <FormGroup>
              <Button
                bsStyle="primary"
                onClick={this.handleRelease}
                disabled={submitting}
              >
                {submitting ? '提交中...' : '提交'}
              </Button>
            </FormGroup>
          </Form>
        </Panel>
      </MainLayout>
    );
  }
}

export default authorityIntercept(TopicRelease);
