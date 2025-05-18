import React from 'react';
import Token from './Token';

class TileComponent extends React.Component {
  render() {
    const { tile, players, onTileClick } = this.props;

    return (
      <button className="Tile" onClick={onTileClick}>
        <Token tile={tile} players={players} />
      </button>
    );
  }
}

export default TileComponent;

