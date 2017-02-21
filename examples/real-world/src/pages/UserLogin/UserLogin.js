import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import {
  Row,
  Col,
  Breadcrumb,
  Panel,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import * as userServices from '../../services/userServices';

import MainLayout from '../../components/MainLayout';

export default class UserLogin extends Component {

  static contextTypes = {
    logon: PropTypes.bool,
    onLogin: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      submitting: false,
    };
  }

  handleLogin = () => {
    const accessToken = findDOMNode(this.refs.accessToken).value;
    if (!accessToken) {
      return;
    }
    this.setState({ submitting: true });
    userServices.login(accessToken)
    .then(({ success, error_msg, ...user }) => {
      this.setState({ submitting: false });
      if (success) {
        const { onLogin } = this.context;
        onLogin && onLogin(accessToken, user);
      } else {
        console.log(error_msg);
      }
    })
    .catch((error) => {
      console.log(error);
      this.setState({ submitting: false });
    });
  }

  renderSidebar = () => {
    return (
      <Panel header="关于">
        <p>CNode：Node.js专业中文社区</p>
        <p>在这里你可以：</p>
        <ul>
          <li>向别人提出你遇到的问题</li>
          <li>帮助遇到问题的人</li>
          <li>分享自己的知识</li>
          <li>和其它人一起进步</li>
        </ul>
      </Panel>
    );
  }

  render() {
    const { submitting } = this.state;
    return (
      <MainLayout
        id="UserLogin"
        sidebar={this.renderSidebar()}
      >
        <Panel
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
                登录
              </Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Row>
            <Col
              smOffset={2}
              sm={8}
              mdOffset={2}
              md={8}
              lgOffset={3}
              lg={6}
            >
              <Form>
                <FormGroup>
                  <ControlLabel>Access Token</ControlLabel>
                  <FormControl
                    ref="accessToken"
                    type="text"
                  />
                </FormGroup>
                <FormGroup>
                  <Button
                    bsStyle="link"
                    className="pull-right"
                  >
                    如何获取 Access Token？
                  </Button>
                  <Button
                    bsStyle="primary"
                    disabled={submitting}
                    onClick={submitting ? null : this.handleLogin}
                  >
                    {submitting ? '登录中...' : '登录'}
                  </Button>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Panel>
      </MainLayout>
    );
  }
}
