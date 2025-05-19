import Tile from '../models/Tile';

class GameEngine {
  constructor(config) {
    this.boardRows = config.boardRows;
    this.boardCols = config.boardCols;
    this.rules = config.rules;
    this.initialScore = config.initialScore;
    this.players = config.players;
    this.playerOrder = Object.keys(this.players);
    this.reset(config.startingPositions);
  }

  reset(startingPositions) {
    this.board = Array.from({ length: this.boardRows }, (_, row) =>
      Array.from({ length: this.boardCols }, (_, col) => new Tile({ row, col }))
    );

    for (const { row, col, token } of startingPositions) {
      this.board[row][col].placeToken(token);
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
    for (let row = 0; row < this.boardRows; row++) {
      for (let col = 0; col < this.boardCols; col++) {
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

    const tile = this.board[row][col];
    if (!tile.isEmpty()) return false;
    if (!this.rules.isValidMove(this.board, row, col, token)) return false;

    const tilesFlipped = this.rules.flipTiles(this.board, row, col, token);
    tile.placeToken(token);

    this.scores = this.rules.calculateNewScores(
      this.scores,
      tilesFlipped,
      playerId,
      this.playerOrder
    );

    const { gameOver, skipTurn } = this.checkGameOver(this.board, playerId);

    // Utilized AI Tools to create elegant logic to check for a game winner
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
      board: this.board,
      currentPlayerId: this.getCurrentPlayerId(),
      scores: this.scores,
      players: this.players,
      gameOver: this.gameOver,
      winner: this.winner
    };
  }
}


export default GameEngine;
