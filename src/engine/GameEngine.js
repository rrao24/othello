import { PLAYERS, TOKEN_TYPE } from '../globals/constants';
import DefaultRules from '../rules/DefaultRules';

class GameEngine {
  constructor(boardSize, rules = null) {
    this.boardSize = boardSize;
    this.rules = rules || new DefaultRules(boardSize);
  }

  getInitialBoard() {
    return this.rules.getInitialBoard();
  }

  getTokenForPlayer(player) {
    return player === PLAYERS.RED ? TOKEN_TYPE.RED : TOKEN_TYPE.BLUE;
  }

  getNextPlayer(player) {
    return player === PLAYERS.RED ? PLAYERS.BLUE : PLAYERS.RED;
  }

  isValidMove(board, row, col, token) {
    return this.rules.isValidMove(board, row, col, token);
  }

  flipTiles(board, row, col, token) {
    return this.rules.flipTiles(board, row, col, token);
  }

  calculateNewScores(currentRed, currentBlue, tilesFlipped, player) {
    return this.rules.calculateNewScores(currentRed, currentBlue, tilesFlipped, player);
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
}

export default GameEngine;