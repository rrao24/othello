import { TOKEN_TYPE } from '../globals/TokenTypes';

class GameEngine {
  constructor(config) {
    this.boardSize = config.boardSize;
    this.rules = config.rules;
    this.initialScore = config.initialScore;
    this.players = config.players;
    this.playerOrder = Object.keys(this.players);
    this.reset(config.startingPositions);
  }

  reset(startingPositions) {
    this.board = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(TOKEN_TYPE.EMPTY)
    );

    for (const { row, col, token } of startingPositions) {
      this.board[row][col] = token;
    }

    this.currentPlayerIndex = 0;
    this.scores = Object.fromEntries(
      Object.entries(this.players).map(([id]) => [id, this.initialScore])
    );
    this.gameOver = false;
    this.winner = null;
  }

  getCurrentPlayerId() {
    return this.playerOrder[this.currentPlayerIndex];
  }

  getTokenForPlayer(playerId) {
    return this.players[playerId].token;
  }

  getNextPlayerIndex(currentIndex) {
    return (currentIndex + 1) % this.playerOrder.length;
  }

  hasValidMove(board, playerId) {
    const token = this.getTokenForPlayer(playerId);
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.rules.isValidMove(board, row, col, token)) {
          return true;
        }
      }
    }
    return false;
  }

  checkGameOver(board, currentPlayerId) {
    const nextIndex = this.getNextPlayerIndex(this.currentPlayerIndex);
    const nextPlayerId = this.playerOrder[nextIndex];
    const currentHasMoves = this.hasValidMove(board, currentPlayerId);
    const nextHasMoves = this.hasValidMove(board, nextPlayerId);

    return {
      gameOver: !currentHasMoves && !nextHasMoves,
      skipTurn: !nextHasMoves && currentHasMoves
    };
  }

  makeMove(row, col) {
    if (this.gameOver) return false;

    const playerId = this.getCurrentPlayerId();
    const token = this.getTokenForPlayer(playerId);

    if (this.board[row][col] !== TOKEN_TYPE.EMPTY) return false;
    if (!this.rules.isValidMove(this.board, row, col, token)) return false;

    const tilesFlipped = this.rules.flipTiles(this.board, row, col, token);
    this.board[row][col] = token;

    this.scores = this.rules.calculateNewScores(
      this.scores,
      tilesFlipped,
      playerId,
      this.playerOrder
    );

    const { gameOver, skipTurn } = this.checkGameOver(this.board, playerId);

    if (gameOver) {
      this.gameOver = true;
      this.currentPlayerIndex = null;
      const scoreEntries = Object.entries(this.scores);
      scoreEntries.sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

      const [topPlayer, topScore] = scoreEntries[0];
      const [, secondScore] = scoreEntries[1];

      this.winner = topScore === secondScore ? 'Tie' : topPlayer;
    } else if (!skipTurn) {
      this.currentPlayerIndex = this.getNextPlayerIndex(this.currentPlayerIndex);
    }

    return true;
  }

  getState() {
    return {
      board: this.board.map(row => row.slice()),
      currentPlayerId: this.getCurrentPlayerId(),
      scores: this.scores,
      players: this.players,
      gameOver: this.gameOver,
      winner: this.winner
    };
  }
}


export default GameEngine;
