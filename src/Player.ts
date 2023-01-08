import config from '../config';

// Player
const Player = () => {
  let marker = config.custom.symbols.player;
  let speed = 1;
  let pos = {
    x: 10,
    y: 10
  }

  const render = () => {
    return '&';
  }

  const checkMovement = (key: string) => {
    switch (key) {
      case 'w':
        pos.x += speed;
        break;
      case 's':
        pos.x -= speed;
        break;
      case 'a':
        pos.y -= speed;
        break;
      case 'd':
        pos.y += speed;
        break;
    }
  }

  const collides = (x: number, y: number) => {
    return pos.x === x && pos.y === y;
  }

  return {
    pos,
    render,
    checkMovement,
    collides
  }
}

export default Player;

