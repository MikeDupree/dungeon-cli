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
  let health = 10;
  let experience = 0;
  let renderCount = 0;
  let marker = config.custom.symbols.player;
  let speed = 1;
  let pos = {
    x: Math.trunc(rows / 2),
    y: Math.trunc(columns / 2)
  }
  let vulnerable = true;

  //Base attack
  let attackPos = [
    { x: pos.x, y: pos.y, direction: 'y', movement: -1 },
    { x: pos.x, y: pos.y, direction: 'y', movement: 1 },
    { x: pos.x, y: pos.y, direction: 'x', movement: -1 },
    { x: pos.x, y: pos.y, direction: 'x', movement: 1 },
  ];
  let baseAttackAge = 0;

  const debug = (title: string, data: any = '') => {
    config.debug && console.log(title, data);
  }

  const render = (mode?: "attack") => {
    if (mode === "attack") return renderAttack();
    renderCount += 1;
    return `\x1b[92m${marker}\x1b[0m`;
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
    for (const pos of attackPos) {
      if (pos.x === x && pos.y === y) {
        return true;
      }
    }
    return false;
  }

  const baseAttack = () => {
    if (renderCount % 2 !== 0) return;
    baseAttackAge += 1;
    if (baseAttackAge <= 10) {
      for (const ap of attackPos) {
        ap[ap.direction] += ap.movement; 
      }
    } else {
      for (const ap of attackPos) {
        ap.x = pos.x;
        ap.y = pos.y;
      }
      baseAttackAge = 0;
    }
  }

  const takeDamage = (dmg: number) => {
    if (vulnerable) {
      health -= dmg;
    }
    vulnerable = false;
    setTimeout(() => vulnerable = true, 500);
  }

  DisplayEmitter.addListener('render', baseAttack);
  ExperienceOrbEmitter.addListener('collected', ({ reward }) => {
    experience += reward;
  });
  PlayerEmitter.on('takeDamage', (dmg) => takeDamage(dmg));

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

export const PlayerLevels = [
  { level: 1, levelAtExperience: 0, experience: 10 },
  { level: 2, levelAtExperience: 10, experience: 25 },
  { level: 3, levelAtExperience: 25, experience: 50 },
  { level: 4, levelAtExperience: 50, experience: 100 },
  { level: 5, levelAtExperience: 100, experience: 250 },
  { level: 6, levelAtExperience: 250, experience: 500 },
];









