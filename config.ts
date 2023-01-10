
const config = {
  debug: false,
  playerStartPos: {
    x: 50,
    y: 50
  },
  controls: {
    up: 'e',
    down: 'd',
    left: 's',
    right: 'f',
  },
  custom: {
    symbols: {
      player: "👨",
      enemy: "X",
      wall: "䷀",
      empty: " ",
      xp: "·",
    }
  },
  display: {
    refreshRate: 50,
    padding: {
      top: 0,
      bottom: 2,
      left: 0,
      right: 0,
    }
  }
};

export default config;
