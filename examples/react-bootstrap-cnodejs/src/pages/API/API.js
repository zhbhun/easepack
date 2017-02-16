import React from 'react';
import {
  Grid,
  Row,
  Col,
  Breadcrumb,
  Panel,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import TopicContent from '../../components/TopicContent';
import html from './html';

export default function API() {

  return (
    <Grid id="API">
      <Row className="show-grid">
        <Col xs={12} md={8} lg={9}>
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
                  API
                </Breadcrumb.Item>
              </Breadcrumb>
            }
          >
            <TopicContent html={html} />
          </Panel>
        </Col>
      </Row>
    </Grid>
  );

}
