import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './pages/App';
import TopicList from './pages/TopicList';
import TopicRelease from './pages/TopicRelease';
import TopicDetail from './pages/TopicDetail';
import UserLogin from './pages/UserLogin';
import UserInfo from './pages/UserInfo';
import UserSetting from './pages/UserSetting';
import Notification from './pages/Notification';
import GetStart from './pages/GetStart';
import API from './pages/API';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={TopicList} />
    <Route path="/topic/create" component={TopicRelease} />
    <Route path="/topic/:id" component={TopicDetail} />
    <Route path="/signin" component={UserLogin} />
    <Route path="/user/:loginname" component={UserInfo} />
    <Route path="/setting" component={UserSetting} />
    <Route path="/my/messages" component={Notification} />
    <Route path="/getstart" component={GetStart} />
    <Route path="/api" component={API} />
    <Route path="/about" component={About} />
    <Route path="*" component={NotFound}/>
  </Route>
);
