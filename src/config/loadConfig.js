export function loadConfig(configObject) {
  return {
    boardSize: configObject.boardSize,
    rules: configObject.rules,
    initialScore: configObject.initialScore,
    startingPositions: configObject.startingPositions,
    players: configObject.players
  };
}