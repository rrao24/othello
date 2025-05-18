import React from 'react';
import Token from './Token';

class Tile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {tokenType: props.tokenType};
  }

  render() {
    return <button className="Tile">
      <Token tokenType={this.state.tokenType} />
    </button>
  }
}

export default Tile;