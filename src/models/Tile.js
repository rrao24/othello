import { TOKEN_TYPE } from '../globals/TokenTypes';

class Tile {
  constructor({ row, col, token = TOKEN_TYPE.EMPTY }) {
    this.row = row;
    this.col = col;
    this.token = token;
  }

  isEmpty() {
    return this.token === TOKEN_TYPE.EMPTY;
  }

  placeToken(token) {
    this.token = token;
  }
}

export default Tile;