import DefaultRules from '../rules/DefaultRules';

export default {
  name: "Classic Othello",
  boardRows: 8,
  boardCols: 8,
  initialScore: 2,
  players: {
    A: { name: 'Red', token: 1, symbol: '🔴' },
    B: { name: 'Blue', token: 2, symbol: '🔵' }
  },
  startingPositions: [
    { row: 3, col: 3, token: 1 },
    { row: 3, col: 4, token: 2 },
    { row: 4, col: 3, token: 2 },
    { row: 4, col: 4, token: 1 }
  ],
  rules: new DefaultRules(8)
};