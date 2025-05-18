import React from 'react';
import Tile from './Tile';
import GameEngine from '../engine/GameEngine';
import classicConfig from '../config/classic';
import { loadConfig } from '../config/loadConfig';

export const PLAYERS = {
  "RED": "RED",
  "BLUE": "BLUE"
};

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
    const { board, currentPlayer, redScore, blueScore, gameOver, winner } = this.state.engineState;
    const tiles = [];

    const board_size = board.length;

    for (let row = 0; row < board_size; row++) {
      for (let col = 0; col < board_size; col++) {
        tiles.push(
          <Tile
            key={`${row}-${col}`}
            tokenType={board[row][col]}
            onTileClick={() => this.handleTileClick(row, col)}
          />
        );
      }
    }

    return (
      <div className="Board">
        <div className="Grid">{tiles}</div>

        <div className="CurrentPlayer">
          {gameOver ? 'Game Over' : `Current Player - ${currentPlayer}`}
        </div>

        <div className="Scoreboard">
          <div className="Score">Red Score - {redScore}</div>
          <div className="Score">Blue Score - {blueScore}</div>
        </div>

        {gameOver && (
          <div className="GameOver">
            <h2>Game Over</h2>
            <p>Final Score - Red: {redScore}, Blue: {blueScore}</p>
            <h3>{winner === 'Tie' ? "It's a tie!" : `${winner} wins!`}</h3>
            <button onClick={this.resetGame}>Restart</button>
          </div>
        )}
      </div>
    );
  }
}

export default Board;