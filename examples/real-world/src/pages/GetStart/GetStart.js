import React, { PropTypes } from 'react';
import {
  Breadcrumb,
  Panel,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import MainLayout from '../../components/MainLayout';
import Sidebar from '../../components/Sidebar';
import TopicContent from '../../components/TopicContent';
import html from './html';

export default function GetStart(props, context) {
  const { logon, user } = context;
  return (
    <MainLayout
      id="GetStart"
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
              Node.js 新手入门
                </Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <TopicContent html={html} />
      </Panel>
    </MainLayout>
  );
}

GetStart.contextTypes = {
  logon: PropTypes.bool,
  user: PropTypes.object,
};
