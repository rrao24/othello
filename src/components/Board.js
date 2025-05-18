import React from 'react';
import TileComponent from './TileComponent';
import GameEngine from '../engine/GameEngine';
import classicConfig from '../config/classic';
import { loadConfig } from '../config/loadConfig';

class Board extends React.Component {
  constructor(props) {
    super(props);

    const gameConfig = loadConfig(classicConfig);
    this.engine = new GameEngine(gameConfig);

    this.state = {
      engineState: this.engine.getState(),
      gameConfig
    };
  }

  handleTileClick = (row, col) => {
    const moveSucceeded = this.engine.makeMove(row, col);
    if (moveSucceeded) {
      this.setState({ engineState: this.engine.getState() });
    }
  };

  resetGame = () => {
    const gameConfig = loadConfig(classicConfig);
    this.engine = new GameEngine(gameConfig);
    this.setState({ engineState: this.engine.getState() });
  };

  render() {
    const { board, currentPlayerId, scores, players, gameOver, winner } = this.state.engineState;
    const tiles = [];

    const board_size = board.length;

    for (let row = 0; row < board_size; row++) {
      for (let col = 0; col < board_size; col++) {
        tiles.push(
          <TileComponent
            key={`${row}-${col}`}
            tile={board[row][col]}
            players={players}
            onTileClick={() => this.handleTileClick(row, col)}
          />
        );
      }
    }

    return (
      <div className="Board">
        <div className="Grid">{tiles}</div>

        <div className="CurrentPlayer">
          {gameOver ? 'Game Over' : `Current Player - ${players[currentPlayerId].name}`}
        </div>

        <div className="Scoreboard">
          {Object.entries(players).map(([id, { name }]) => (
            <div className="Score" key={id}>
              {name} Score - {scores[id]}
            </div>
          ))}
        </div>

        {gameOver && (
          <>
            <h3>
              {winner === 'Tie' ? "It's a tie!" : `${players[winner]?.name ?? winner} wins!`}
            </h3>
          </>
        )}
      </div>
    );
  }
}

export default Board;