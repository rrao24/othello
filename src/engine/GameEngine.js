// src/engine/GameEngine.js
import { TOKEN_TYPE } from '../globals/TokenTypes';
import DefaultRules from '../rules/DefaultRules';

const PLAYERS = {
  "RED": "RED",
  "BLUE": "BLUE"
};

class GameEngine {
  constructor(config) {
    this.boardSize = config.boardSize;
    this.rules = config.rules;
    this.initialScore = config.initialScore;
    this.reset(config.startingPositions);
  }

  reset(startingPositions) {
    this.board = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(TOKEN_TYPE.EMPTY)
    );

    for (const { row, col, token } of startingPositions) {
      this.board[row][col] = token;
    }

    this.currentPlayer = PLAYERS.RED;
    this.redScore = this.initialScore;
    this.blueScore = this.initialScore;
    this.gameOver = false;
    this.winner = null;
  }

  getState() {
    return {
      board: this.board.map(row => row.slice()),
      currentPlayer: this.currentPlayer,
      redScore: this.redScore,
      blueScore: this.blueScore,
      gameOver: this.gameOver,
      winner: this.winner
    };
  }

  getTokenForPlayer(player) {
    return player === PLAYERS.RED ? TOKEN_TYPE.RED : TOKEN_TYPE.BLUE;
  }

  getNextPlayer(player) {
    return player === PLAYERS.RED ? PLAYERS.BLUE : PLAYERS.RED;
  }

  hasValidMove(board, player) {
    const token = this.getTokenForPlayer(player);
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.rules.isValidMove(board, row, col, token)) {
          return true;
        }
      }
    }
    return false;
  }

  checkGameOver(board, currentPlayer) {
    const nextPlayer = this.getNextPlayer(currentPlayer);
    const currentHasMoves = this.hasValidMove(board, currentPlayer);
    const nextHasMoves = this.hasValidMove(board, nextPlayer);

    return {
      gameOver: !currentHasMoves && !nextHasMoves,
      skipTurn: !nextHasMoves && currentHasMoves
    };
  }

  makeMove(row, col) {
    if (this.gameOver) return false;

    const token = this.getTokenForPlayer(this.currentPlayer);
    if (this.board[row][col] !== TOKEN_TYPE.EMPTY) return false;
    if (!this.rules.isValidMove(this.board, row, col, token)) return false;

    const tilesFlipped = this.rules.flipTiles(this.board, row, col, token);
    this.board[row][col] = token;

    const { redScore, blueScore } = this.rules.calculateNewScores(
      this.redScore,
      this.blueScore,
      tilesFlipped,
      this.currentPlayer
    );

    this.redScore = redScore;
    this.blueScore = blueScore;

    const { gameOver, skipTurn } = this.checkGameOver(this.board, this.currentPlayer);

    if (gameOver) {
      this.gameOver = true;
      this.currentPlayer = null;
      this.winner =
        redScore > blueScore ? PLAYERS.RED :
        blueScore > redScore ? PLAYERS.BLUE :
        'Tie';
    } else if (!skipTurn) {
      this.currentPlayer = this.getNextPlayer(this.currentPlayer);
    }

    return true;
  }
}

export default GameEngine;
