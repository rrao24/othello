import React from 'react';

class Token extends React.Component {
  render() {
    const { tile, players } = this.props;
    const tokenType = tile.token;

    const playerEntry = Object.entries(players).find(
      ([, player]) => player.token === tokenType
    );
    
    return <span>{playerEntry ? playerEntry[1].symbol : ''}</span>;
  }
}

export default Token;
