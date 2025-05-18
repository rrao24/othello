import React from 'react';
import { BOARD_SIZE, TOKEN_TYPE, PLAYERS, INITIAL_SCORE } from '../globals/constants';
import Tile from './Tile';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.boardSize = BOARD_SIZE;
    this.currentPlayer = PLAYERS.RED;

    this.board = [];

    for (let row = 0; row < this.boardSize; row++) {
      let gameRow = [];

      for (let col = 0; col < this.boardSize; col++) {
        gameRow.push(TOKEN_TYPE.EMPTY);
      }

      this.board.push(gameRow);
    }

    this.board[3][3] = TOKEN_TYPE.RED;
    this.board[3][4] = TOKEN_TYPE.BLUE;
    this.board[4][3] = TOKEN_TYPE.BLUE;
    this.board[4][4] = TOKEN_TYPE.RED;

    this.state = {
      board: this.board,
      currentPlayer: this.currentPlayer,
      redScore: INITIAL_SCORE,
      blueScore: INITIAL_SCORE
    };

    this.handleTileClick = this.handleTileClick.bind(this);
  }

  handleTileClick = (row, col) => {
    if (this.board[row][col] !== TOKEN_TYPE.EMPTY) {
      return;
    }

    let token;
    let nextPlayer;

    if (this.currentPlayer === PLAYERS.RED) {
      token = TOKEN_TYPE.RED;
      nextPlayer = PLAYERS.BLUE;
    } else {
      token = TOKEN_TYPE.BLUE;
      nextPlayer = PLAYERS.RED;
    }

    let isMoveValid = false;
    let tilesFlipped = 0;

    let directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ];

    for (let direction of directions) {
      let currentRow = row + direction[0];
      let currentCol = col + direction[1];

      while (true) {
        if (
          currentRow < 0 ||
          currentCol < 0 ||
          currentRow >= this.boardSize ||
          currentCol >= this.boardSize ||
          this.board[currentRow][currentCol] === TOKEN_TYPE.EMPTY
        ) {
          break;
        }

        if (this.board[currentRow][currentCol] === token) {
          break;
        }

        currentRow += direction[0];
        currentCol += direction[1];
      }

      currentRow -= direction[0];
      currentCol -= direction[1];

      while (!(currentRow === row && currentCol === col)) {
        this.board[currentRow][currentCol] = token;

        tilesFlipped++;
        isMoveValid = true;

        currentRow -= direction[0];
        currentCol -= direction[1];
      }
    }

    if (isMoveValid) {
      this.board[row][col] = token;

      let redScore;
      let blueScore;

      if (this.currentPlayer === PLAYERS.RED) {
        redScore = this.state.redScore + tilesFlipped + 1;
        blueScore = this.state.blueScore - tilesFlipped;
      } else {
        blueScore = this.state.blueScore + tilesFlipped + 1;
        redScore = this.state.redScore - tilesFlipped;
      }

      this.currentPlayer = nextPlayer;

      this.setState({
        board: this.board,
        currentPlayer: this.currentPlayer,
        redScore: redScore,
        blueScore: blueScore
      });
    }
  };

  render() {
    let tiles = [];
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        let tile = (
          <Tile
            tokenType={this.state.board[row][col]}
            onTileClick={() => this.handleTileClick(row, col)}
          />
        );
        tiles.push(tile);
      }
    }

    return (
      <div className="Board">
        <div className="Grid">{tiles}</div>
        <div className="CurrentPlayer">
          Current Player - {this.state.currentPlayer}
        </div>
        <div className="Scoreboard">
          <div className="Score">Red Score - {this.state.redScore}</div>
          <div className="Score">Blue Score - {this.state.blueScore}</div>
        </div>
      </div>
    );
  }
}

export default Board;