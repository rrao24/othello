import DefaultRules from '../rules/DefaultRules';
import { TOKEN_TYPE } from '../globals/TokenTypes';

export default {
  name: "Classic Othello",
  boardSize: 8,
  initialScore: 2,
  startingPositions: [
    { row: 3, col: 3, token: TOKEN_TYPE.RED },
    { row: 3, col: 4, token: TOKEN_TYPE.BLUE },
    { row: 4, col: 3, token: TOKEN_TYPE.BLUE },
    { row: 4, col: 4, token: TOKEN_TYPE.RED }
  ],
  rules: new DefaultRules(8)
};
