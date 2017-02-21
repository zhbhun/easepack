import React, { PropTypes, Component } from 'react';
import {
  Panel,
  Button,
  Image,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import UserThumbnail from '../UserThumbnail';

class Sidebar extends Component {

  static propTypes = {
    userThumbnailTitle: PropTypes.string,
    user: PropTypes.object,
    topicReleasable: PropTypes.bool,
    barcodeVisible: PropTypes.bool,
  };

  render() {
    const {
      userThumbnailTitle,
      user,
      topicReleasable,
      barcodeVisible,
    } = this.props;
    return (
      <div>
        <UserThumbnail
          title={userThumbnailTitle}
          user={user}
        />
        {
          topicReleasable ?
            <Panel>
              <LinkContainer to="/topic/create">
                <Button bsStyle="primary">发布话题</Button>
              </LinkContainer>
            </Panel> :
            null
        }
        {
          barcodeVisible ?
            <Panel header="客户端二维码">
              <Image
                rounded
                responsive
                src="https://dn-cnode.qbox.me/FtG0YVgQ6iginiLpf9W4_ShjiLfU"
              />
            </Panel> :
            null
        }
      </div>
    );
  }
}

export default Sidebar;
