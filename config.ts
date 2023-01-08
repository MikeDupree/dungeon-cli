
const config = {
  debug: false,
  controls: {
    up: 'e',
    down: 'd',
    left: 's',
    right: 'f',
  },
  custom: {
    symbols: {
      player: "&",
      enemy: "X",
      wall: "#",
      empty: " ",
      xp: "·",
    }
  },
  display: {
    refreshRate: 50,
    padding: {
      top: 0,
      bottom: 1,
      left: 3,
      right: 3,
    }
  }
};

export default config;
