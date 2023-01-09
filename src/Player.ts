import { EventEmitter } from "events";
import config from '../config';
import { DisplayEmitter } from "./Display";
import { isBorderWall } from "./Environment";
import { ExperienceOrbEmitter } from "./ExperienceOrbs";
import { CharacterInterface, Pos } from './types';

const { up, down, left, right } = config.controls;
const { columns, rows } = process.stdout;

export const PlayerEmitter = new EventEmitter();

export interface PlayerInterface extends CharacterInterface {
  experience: number;
  checkInput: (key: string) => void;
  attackCollides: (pos: Pos) => boolean;
}

// Player
const Player = () => {
  let experience = 0;
  ExperienceOrbEmitter.addListener('collected', ({reward}) => {
    experience += reward;
  });
  let renderCount = 0;
  let marker = config.custom.symbols.player;
  let speed = 1;
  let pos = {
    x: Math.trunc(rows / 2),
    y: Math.trunc(columns / 2)
  }

  //Base attack
  let baseAttackPos = { x: pos.x, y: pos.y };
  let baseAttackAge = 0;

  const debug = (title: string, data: any = '') => {
    config.debug && console.log(title, data);
  }

  const render = (mode?: "attack") => {
    debug('player render', pos);
    if (mode === "attack") return renderAttack();
    renderCount += 1;
    return `\x1b[92m${marker}\x1b[0m`;
  }

  const renderAttack = () => {
    return '-';
  }

  const checkInput = (key: string) => {
    debug('player move check');
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
    debug('player moved', pos);
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
    experience,
    pos,
    render,
    checkInput,
    collides,
    attackCollides
  }
}

export default Player;

