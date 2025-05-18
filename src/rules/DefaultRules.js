import { DIRECTIONS } from './Directions';

class DefaultRules {
  constructor(boardSize) {
    this.boardSize = boardSize;
  }

  isValidMove(board, row, col, token) {
    if (!board[row][col].isEmpty()) return false;

    for (const [dx, dy] of DIRECTIONS) {
      const path = this.getFlippablePath(board, row, col, dx, dy, token);
      if (path.length > 0) return true;
    }

    return false;
  }

  getFlippablePath(board, row, col, dx, dy, playerToken) {
    const path = [];
    let r = row + dx;
    let c = col + dy;
    let foundOpponent = false;

    while (r >= 0 && c >= 0 && r < this.boardSize && c < this.boardSize) {
      const currentToken = board[r][c].token;

      if (currentToken === 0) {
        break;
      } else if (currentToken !== playerToken) {
        path.push([r, c]);
        foundOpponent = true;
      } else {
        return foundOpponent ? path : [];
      }

      r += dx;
      c += dy;
    }

    return [];
  }


  flipTiles(board, row, col, token) {
    let tilesFlipped = 0;

    for (const [dx, dy] of DIRECTIONS) {
      const path = this.getFlippablePath(board, row, col, dx, dy, token);

      for (const [r, c] of path) {
        board[r][c].placeToken(token);
        tilesFlipped++;
      }
    }

    return tilesFlipped;
  }


  calculateNewScores(currentScores, tilesFlipped, playerId, playerOrder) {
    const newScores = { ...currentScores };

    const opponentId = playerOrder.find(id => id !== playerId);
    newScores[playerId] += tilesFlipped + 1;
    newScores[opponentId] -= tilesFlipped;

    return newScores;
  }
}


export default DefaultRules;