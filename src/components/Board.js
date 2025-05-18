import React from 'react';
import { BOARD_SIZE, PLAYERS } from '../globals/constants';
import Tile from './Tile';
import GameEngine from '../engine/GameEngine';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.engine = new GameEngine(BOARD_SIZE);
    this.state = {
      engineState: this.engine.getState()
    };
  }

  handleTileClick = (row, col) => {
    const moveSucceeded = this.engine.makeMove(row, col);
    if (moveSucceeded) {
      this.setState({ engineState: this.engine.getState() });
    }
  };

  resetGame = () => {
    this.engine.reset();
    this.setState({ engineState: this.engine.getState() });
  };

  render() {
    const { board, currentPlayer, redScore, blueScore, gameOver, winner } = this.state.engineState;
    const tiles = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
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