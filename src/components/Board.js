import React from 'react';
import { BOARD_SIZE, TOKEN_TYPE } from '../globals/constants';
import Tile from './Tile';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.boardSize = BOARD_SIZE;
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
      board: this.board
    };
  }

  render() {
    let tiles = [];
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        let tile = <Tile tokenType={this.state.board[row][col]}></Tile>
        tiles.push(tile);
      }
    }

    return (
        <div className="Board">
          <div className="Grid">
            {tiles}
          </div>
        </div>
      );
  }
}

export default Board;