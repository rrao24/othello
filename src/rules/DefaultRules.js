import { TOKEN_TYPE, DIRECTIONS } from '../globals/constants';

class DefaultRules {
  constructor(boardSize) {
    this.boardSize = boardSize;
  }

  getInitialBoard() {
    const board = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(TOKEN_TYPE.EMPTY)
    );

    const mid = this.boardSize / 2;
    board[mid - 1][mid - 1] = TOKEN_TYPE.RED;
    board[mid - 1][mid] = TOKEN_TYPE.BLUE;
    board[mid][mid - 1] = TOKEN_TYPE.BLUE;
    board[mid][mid] = TOKEN_TYPE.RED;

    return board;
  }

  isValidMove(board, row, col, token) {
    if (board[row][col] !== TOKEN_TYPE.EMPTY) return false;

    for (const [dx, dy] of DIRECTIONS) {
      const path = this.getFlippablePath(board, row, col, dx, dy, token);
      if (path.length > 0) return true;
    }

    return false;
  }

  getFlippablePath(board, row, col, dx, dy, token) {
    const opponent = token === TOKEN_TYPE.RED ? TOKEN_TYPE.BLUE : TOKEN_TYPE.RED;
    const path = [];
    let r = row + dx;
    let c = col + dy;

    while (r >= 0 && c >= 0 && r < this.boardSize && c < this.boardSize) {
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
  }

  flipTiles(board, row, col, token) {
    let tilesFlipped = 0;

    for (const [dx, dy] of DIRECTIONS) {
      const path = this.getFlippablePath(board, row, col, dx, dy, token);

      for (const [r, c] of path) {
        board[r][c] = token;
        tilesFlipped++;
      }
    }

    return tilesFlipped;
  }

  calculateNewScores(currentRed, currentBlue, tilesFlipped, player) {
    if (player === 'RED') {
      return {
        redScore: currentRed + tilesFlipped + 1,
        blueScore: currentBlue - tilesFlipped
      };
    } else {
      return {
        blueScore: currentBlue + tilesFlipped + 1,
        redScore: currentRed - tilesFlipped
      };
    }
  }
}

export default DefaultRules;