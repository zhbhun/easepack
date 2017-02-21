import React, { PropTypes, Component } from 'react';
import { Navbar, Nav, NavItem, FormGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

class App extends Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  static childContextTypes = {
    logon: PropTypes.bool,
    user: PropTypes.object,
    accessToken: PropTypes.string,
    onLogin: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      logon: false,
      user: null,
      accessToken: '',
    };
  }

  getChildContext() {
    const { logon, user, accessToken } = this.state;
    return {
      logon,
      user,
      accessToken,
      onLogin: this.handleLogin,
    };
  }

  handleLogin = (accessToken, user) => {
    this.setState({
      logon: true,
      user,
      accessToken,
    });
    this.context.router.replace('/');
  }

  handleLogout = () => {
    this.setState({
      logon: false,
      user: null,
    });
    this.context.router.replace('/');
  }

  renderLogoutNavbar() {
    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">CNODE</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Form pullLeft>
            <FormGroup>
              <FormControl type="text" placeholder="Search" />
            </FormGroup>
          </Navbar.Form>
          <Nav pullRight>
            <LinkContainer to="/">
              <NavItem>首页</NavItem>
            </LinkContainer>
            <LinkContainer to="/getstart">
              <NavItem>新手入门</NavItem>
            </LinkContainer>
            <LinkContainer to="/api">
              <NavItem>API</NavItem>
            </LinkContainer>
            <LinkContainer to="/about">
              <NavItem>关于</NavItem>
            </LinkContainer>
            <LinkContainer to="/signin">
              <NavItem>登录</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  renderLogonNavbar() {
    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">CNODE</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Form pullLeft>
            <FormGroup>
              <FormControl type="text" placeholder="Search" />
            </FormGroup>
          </Navbar.Form>
          <Nav pullRight>
            <LinkContainer to="/">
              <NavItem>首页</NavItem>
            </LinkContainer>
            <LinkContainer to="/my/messages">
              <NavItem>未读消息</NavItem>
            </LinkContainer>
            <LinkContainer to="/getstart">
              <NavItem>新手入门</NavItem>
            </LinkContainer>
            <LinkContainer to="/api">
              <NavItem>API</NavItem>
            </LinkContainer>
            <LinkContainer to="/about">
              <NavItem>关于</NavItem>
            </LinkContainer>
            <LinkContainer to="/setting">
              <NavItem>设置</NavItem>
            </LinkContainer>
            <NavItem onClick={this.handleLogout}>退出</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }


  renderFooter() {
    return (
      <div id="footer">
        <div className='container'>
          <div className="links">
            <a className='dark' href='https://cnodejs.org/rss'>RSS</a>
            <span>|</span>
            <a className='dark' href='https://github.com/cnodejs/nodeclub/'>源码地址</a>
          </div>
          <div className='col_fade'>
            <p>
              CNode 社区为国内最专业的 Node.js 开源技术社区，致力于 Node.js 的技术研究。
            </p>
            <p>
              <span>服务器赞助商为</span>
              <a href="http://www.ucloud.cn/" target="_blank" className="sponsor_outlink" data-label="ucloud_bottom">
                <img src="https://dn-cnode.qbox.me/FuIpEaM9bvsZKnQ3QfPtBHWQmLM9" title="ucloud" alt="ucloud"/>
              </a>
              <span>，存储赞助商为</span>
              <a href="http://www.qiniu.com/" target="_blank" className="sponsor_outlink" data-label="qiniu_bottom">
                <img src="https://dn-cnode.qbox.me/Fg0jtDIcTqVC049oVu5-sn6Om4NX" title="qiniu" alt="七牛云存储"/>
              </a>
              <span>，由</span>
              <a href="https://alinode.aliyun.com/?ref=cnode" target="_blank" className="sponsor_outlink" data-label="alinode_bottom">
                <img src="https://dn-cnode.qbox.me/FpMZk31PDyxkC8yStmMQL4XroaGD" title="alinode" alt="alinode" height="54px" />
              </a>
              <span>提供应用性能服务。</span>
            </p>
            <p>
              <span>新手搭建 Node.js 服务器，推荐使用无需备案的</span>
              <a href="https://www.digitalocean.com/?refcode=eba02656eeb3">DigitalOcean(https://www.digitalocean.com/)</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { logon } = this.state;
    return (
      <div id="App">
        {logon ? this.renderLogonNavbar() : this.renderLogoutNavbar()}
        {this.props.children}
        {this.renderFooter()}
      </div>
    );
  }
}

export default App;
