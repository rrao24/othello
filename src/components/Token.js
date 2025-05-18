import React from 'react';
import { TOKEN_TYPE } from '../globals/TokenTypes';

class Token extends React.Component {
  render() {
    let token;

    if (this.props.tokenType === TOKEN_TYPE.RED) {
      token = <span>🔴</span>;
    } else if (this.props.tokenType === TOKEN_TYPE.BLUE) {
      token = <span>🔵</span>;
    } else {
      token = <span />;
    }

    return token;
  }
}

export default Token;