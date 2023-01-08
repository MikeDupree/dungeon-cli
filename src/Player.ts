import { EventEmitter } from "events";
import config from '../config';
import { DisplayEmitter } from "./Display";
import { isBorderWall } from "./Environment";
import { CharacterInterface, Pos } from './types';

const { up, down, left, right } = config.controls;

export const PlayerEmitter = new EventEmitter();

export interface PlayerInterface extends CharacterInterface {
  checkInput: (key: string) => void;
  attackCollides: (pos: Pos) => boolean;
}

// Player
const Player = () => {
  let renderCount = 0;
  let marker = config.custom.symbols.player;
  let speed = 1;
  let pos = {
    x: 50,
    y: 50
  }

  //Base attack
  let baseAttackPos = { x: pos.x, y: pos.y };
  let baseAttackAge = 0;

  const render = (mode?: "attack") => {
    if (mode === "attack") return renderAttack();
    renderCount += 1;
    return marker;
  }

  const renderAttack = () => {
    return '-';
  }

  const checkInput = (key: string) => {
    switch (key) {
      case up:
        if (isBorderWall(pos.x - 1, pos.y)) return;
        pos.x -= speed;
        break;
      case down:
        if (isBorderWall(pos.x + 1, pos.y)) return;
        pos.x += speed;
        break;
      case left:
        if (isBorderWall(pos.x, pos.y - 1)) return;
        pos.y -= speed;
        break;
      case right:
        if (isBorderWall(pos.x, pos.y + 1)) return;
        pos.y += speed;
        break;
    }
    PlayerEmitter.emit("move", pos);
  }

  const collides = ({ x, y }: Pos) => {
    return pos.x === x && pos.y === y;
  }

  const attackCollides = ({ x, y }: Pos) => {
    return baseAttackPos.x === x && baseAttackPos.y === y;
  }

  const baseAttack = () => {
    if (renderCount % 5 !== 0) return;
    baseAttackAge += 1;
    if (baseAttackAge <= 5) {
      baseAttackPos.y -= 1;
    } else {
      baseAttackPos.x = pos.x;
      baseAttackPos.y = pos.y;
      baseAttackAge = 0;
    }
  }

  DisplayEmitter.addListener('render', baseAttack);

  return {
    pos,
    render,
    checkInput,
    collides,
    attackCollides
  }
}

export default Player;

