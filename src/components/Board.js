import React from 'react';
import { BOARD_SIZE, TOKEN_TYPE, PLAYERS, INITIAL_SCORE, DIRECTIONS } from '../globals/constants';
import Tile from './Tile';
import GameEngine from '../engine/GameEngine';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.boardSize = BOARD_SIZE;

    this.engine = new GameEngine(this.boardSize);

    this.state = {
      board: this.createInitialBoard(),
      currentPlayer: PLAYERS.RED,
      redScore: INITIAL_SCORE,
      blueScore: INITIAL_SCORE,
      gameOver: false,
      winner: null
    };
  }

  createInitialBoard = () => {
    let board = [];

    for (let row = 0; row < this.boardSize; row++) {
      let gameRow = [];

      for (let col = 0; col < this.boardSize; col++) {
        gameRow.push(TOKEN_TYPE.EMPTY);
      }

      board.push(gameRow);
    }

    board[(this.boardSize/2) - 1][(this.boardSize/2) - 1] = TOKEN_TYPE.RED;
    board[(this.boardSize/2) - 1][this.boardSize/2] = TOKEN_TYPE.BLUE;
    board[this.boardSize/2][(this.boardSize/2) - 1] = TOKEN_TYPE.BLUE;
    board[this.boardSize/2][this.boardSize/2] = TOKEN_TYPE.RED;

    return board;
  }

  handleTileClick = (row, col) => {
    if (this.state.gameOver) return;

    const boardCopy = this.state.board.map(row => row.slice());
    const token = this.engine.getTokenForPlayer(this.state.currentPlayer);

    if (boardCopy[row][col] !== TOKEN_TYPE.EMPTY) return;
    if (!this.engine.isValidMove(boardCopy, row, col, token)) return;

    const tilesFlipped = this.engine.flipTiles(boardCopy, row, col, token);
    boardCopy[row][col] = token;

    const { redScore, blueScore } = this.engine.calculateNewScores(
      this.state.redScore,
      this.state.blueScore,
      tilesFlipped,
      this.state.currentPlayer
    );

    const nextPlayer = this.engine.getNextPlayer(this.state.currentPlayer);
    const { gameOver, skipTurn } = this.engine.checkGameOver(boardCopy, this.state.currentPlayer);

    if (gameOver) {
      const winner =
        redScore > blueScore ? PLAYERS.RED :
        blueScore > redScore ? PLAYERS.BLUE : 'Tie';

      this.setState({
        board: boardCopy,
        redScore,
        blueScore,
        currentPlayer: null,
        gameOver: true,
        winner
      });
      return;
    }

    if (skipTurn) {
      alert(`${nextPlayer} has no valid moves. Turn skipped.`);
      this.setState({
        board: boardCopy,
        redScore,
        blueScore,
        currentPlayer: this.state.currentPlayer
      });
    } else {
      this.setState({
        board: boardCopy,
        redScore,
        blueScore,
        currentPlayer: nextPlayer
      });
    }
  };

  render() {
    const tiles = [];
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        tiles.push(
          <Tile
            key={`${row}-${col}`}
            tokenType={this.state.board[row][col]}
            onTileClick={() => this.handleTileClick(row, col)}
          />
        );
      }
    }

    return (
      <div className="Board">
        <div className="Grid">{tiles}</div>
        <div className="CurrentPlayer">
          {this.state.gameOver
            ? 'Game Over'
            : `Current Player - ${this.state.currentPlayer}`}
        </div>
        <div className="Scoreboard">
          <div className="Score">Red Score - {this.state.redScore}</div>
          <div className="Score">Blue Score - {this.state.blueScore}</div>
        </div>
        {this.state.gameOver && (
          <div className="GameOver">
            <h2>Game Over</h2>
            <p>Final Score - Red: {this.state.redScore}, Blue: {this.state.blueScore}</p>
            <h3>
              {this.state.winner === 'Tie'
                ? "It's a tie!"
                : `${this.state.winner} wins!`}
            </h3>
          </div>
        )}
      </div>
    );
  }
}

export default Board;