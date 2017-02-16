import React, { PropTypes } from 'react';
import {
  Breadcrumb,
  Panel,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import TopicContent from '../../components/TopicContent';
import MainLayout from '../../components/MainLayout';
import Sidebar from '../../components/Sidebar';

import html from './html';

export default function About(props, context) {
  const { logon, user } = context;
  return (
    <MainLayout
      id="About"
      sidebar={
        <Sidebar
          userThumbnailTitle="个人信息"
          user={user}
          topicReleasable={logon}
          barcodeVisible
        />
      }
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
              关于
            </Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <TopicContent html={html} />
      </Panel>
    </MainLayout>
  );
}

About.contextTypes = {
  logon: PropTypes.bool,
  user: PropTypes.object,
};
