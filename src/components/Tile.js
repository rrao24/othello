import React from 'react';
import Token from './Token';

class Tile extends React.Component {
  constructor(props) {
    super(props);

    this.onTileClick = props.onTileClick;

    this.state = {tokenType: props.tokenType};
  }

  render() {
    return <button className="Tile">
      <Token tokenType={this.state.tokenType} onClick={this.onTileClick} />
    </button>
  }
}

export default Tile;