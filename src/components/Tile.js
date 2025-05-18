import React from 'react';
import Token from './Token';


// Utilized AI Tools to determine that the onClick function needed to be defined
// At the button level, not at the Token level
class Tile extends React.Component {
  render() {
    return (
      <button className="Tile" onClick={this.props.onTileClick}>
        <Token tokenType={this.props.tokenType} />
      </button>
    );
  }
}

export default Tile;