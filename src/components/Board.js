import React from 'react';
import { BOARD_SIZE, TOKEN_TYPE, PLAYERS, INITIAL_SCORE, DIRECTIONS } from '../globals/constants';
import Tile from './Tile';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.boardSize = BOARD_SIZE;

    this.state = {
      board: this.createInitialBoard(),
      currentPlayer: PLAYERS.RED,
      redScore: INITIAL_SCORE,
      blueScore: INITIAL_SCORE
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

  getTokenForPlayer = (player) => {
    return player === PLAYERS.RED ? TOKEN_TYPE.RED : TOKEN_TYPE.BLUE;
  };

  getNextPlayer = (currentPlayer) => {
    return currentPlayer === PLAYERS.RED ? PLAYERS.BLUE : PLAYERS.RED;
  };

  // Utilized AI Tools to help write code to determine when to skip a turn
  // And to determine when the game is over (when neither player has valid moves)
  hasValidMove = (board, player) => {
    const token = this.getTokenForPlayer(player);
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (board[row][col] === TOKEN_TYPE.EMPTY && this.isValidMove(board, row, col, token)) {
          return true;
        }
      }
    }

    return false;
  }

  getFlippablePath = (board, row, col, dx, dy, token) => {
    const opponent = token === TOKEN_TYPE.RED ? TOKEN_TYPE.BLUE : TOKEN_TYPE.RED;
    const path = [];
    let r = row + dx;
    let c = col + dy;

    while (
      r >= 0 && c >= 0 &&
      r < this.boardSize && c < this.boardSize
    ) {
      const current = board[r][c];

      if (current === opponent) {
        path.push([r, c]);
      } else if (current === token && path.length > 0) {
        return path;
      } else {
        break;
      }

      r += dx;
      c += dy;
    }

    return [];
  };

  isValidMove = (board, row, col, token) => {
    if (board[row][col] !== TOKEN_TYPE.EMPTY) {
      return false;
    }

    for (const [dx, dy] of DIRECTIONS) {
      const path = this.getFlippablePath(board, row, col, dx, dy, token);
      if (path.length > 0) {
        return true;
      }
    }

    return false;
  };

  flipTiles = (board, row, col, token) => {
    let tilesFlipped = 0;

    for (const [dx, dy] of DIRECTIONS) {
      const path = this.getFlippablePath(board, row, col, dx, dy, token);

      for (const [r, c] of path) {
        board[r][c] = token;
        tilesFlipped++;
      }
    }

    return tilesFlipped;
  };

  calculateNewScores = (tilesFlipped, player) => {
    if (player === PLAYERS.RED) {
      return {
        redScore: this.state.redScore + tilesFlipped + 1,
        blueScore: this.state.blueScore - tilesFlipped
      };
    } else {
      return {
        blueScore: this.state.blueScore + tilesFlipped + 1,
        redScore: this.state.redScore - tilesFlipped
      };
    }
  };

  handleTileClick = (row, col) => {
    // Utilized AI Tools to understand that React requires to use copies of objects
    // In order to update state
    const boardCopy = this.state.board.map(row => row.slice());

    if (boardCopy[row][col] !== TOKEN_TYPE.EMPTY) {
      return;
    }

    const token = this.getTokenForPlayer(this.state.currentPlayer);
    const nextPlayer = this.getNextPlayer(this.state.currentPlayer);

    let tilesFlipped = this.flipTiles(boardCopy, row, col, token);

    if (tilesFlipped > 0) {
      boardCopy[row][col] = token;

      const { redScore, blueScore } = this.calculateNewScores(tilesFlipped, this.state.currentPlayer);

      let updatedCurrentPlayer = nextPlayer;

      if (!this.hasValidMove(boardCopy, nextPlayer)) {
        if (this.hasValidMove(boardCopy, this.state.currentPlayer)) {
          updatedCurrentPlayer = this.state.currentPlayer;
          alert(`${nextPlayer} has no valid moves. Turn skipped.`);
        } else {
          alert("No valid moves for either player. Game over!");
        }
      }

      this.setState({
        board: boardCopy,
        currentPlayer: nextPlayer,
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