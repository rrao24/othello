import { TOKEN_TYPE, PLAYERS, DIRECTIONS } from '../globals/constants';

export default class GameEngine {
  constructor(boardSize) {
    this.boardSize = boardSize;
  }

  getTokenForPlayer(player) {
    return player === PLAYERS.RED ? TOKEN_TYPE.RED : TOKEN_TYPE.BLUE;
  }

  getNextPlayer(currentPlayer) {
    return currentPlayer === PLAYERS.RED ? PLAYERS.BLUE : PLAYERS.RED;
  }

  getFlippablePath(board, row, col, dx, dy, token) {
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
  }

  isValidMove(board, row, col, token) {
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
  }

  hasValidMove(board, player) {
    const token = this.getTokenForPlayer(player);

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.isValidMove(board, row, col, token)) {
          return true;
        }
      }
    }

    return false;
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

  calculateNewScores(prevRedScore, prevBlueScore, tilesFlipped, player) {
    if (player === PLAYERS.RED) {
      return {
        redScore: prevRedScore + tilesFlipped + 1,
        blueScore: prevBlueScore - tilesFlipped
      };
    } else {
      return {
        blueScore: prevBlueScore + tilesFlipped + 1,
        redScore: prevRedScore - tilesFlipped
      };
    }
  }

  checkGameOver(board, currentPlayer) {
    const nextPlayer = this.getNextPlayer(currentPlayer);

    const currentCanMove = this.hasValidMove(board, currentPlayer);
    const nextCanMove = this.hasValidMove(board, nextPlayer);

    return {
      gameOver: !currentCanMove && !nextCanMove,
      skipTurn: !nextCanMove && currentCanMove
    };
  }
}