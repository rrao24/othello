export function loadConfig(configObject) {
  return {
    boardRows: configObject.boardRows,
    boardCols: configObject.boardCols,
    rules: configObject.rules,
    initialScore: configObject.initialScore,
    startingPositions: configObject.startingPositions,
    players: configObject.players
  };
}