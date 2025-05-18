import React from 'react';
import { TOKEN_TYPE } from '../globals/constants';

class Token extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tokenType: props.tokenType};
  }

  render() {
    let token;

    if (this.state.tokenType === TOKEN_TYPE.RED) {
      token = <span>🔴</span>;
    } else if (this.state.tokenType === TOKEN_TYPE.BLUE) {
      token = <span>🔵</span>;
    } else {
      token = <span />;
    }

    return token;
  }
}

export default Token;