import config from "../config";
import { CharacterInterface, Pos } from "./types";
import { PlayerEmitter } from "./Player";
import { DisplayEmitter } from "./Display";
import { SpawnEmitter } from "./SpawnController";
import { randomUUID } from "crypto";


export interface EnemyInterface extends Omit<CharacterInterface, "collides"> {
  id: any,
  move: (enemies: EnemyInterface[]) => void;
  collides: (pos: Pos, dmg?: number) => boolean;
  rewardXP: number;
}


const getRandomPos = (playerPos: Pos) => {
  const getRandomInt = (max: number) => {
    return Math.ceil(Math.random() * (max - 5) + 5);
  }
  const { stdout } = process;
  const { columns, rows } = stdout;
  let x = 0;
  let y = 0;
  let maxAttempts = 50;
  let attempt = 0;

  while (x === 0 && y === 0) {
    attempt++;
    let rx = getRandomInt(rows);
    let ry = getRandomInt(columns);

    if (rx > playerPos.x + 15 && rx < playerPos.x - 15) {
      x = rx;
    }
    if (ry > playerPos.y + 15 && ry < playerPos.y - 15) {
      y = ry;
    }

    if (attempt >= maxAttempts){
      return {
        x: rx,
        y: ry
      }
    }
  }

  return {
    x,
    y
  }
}

// Enemy
const Enemy = (currentPlayerPos: Pos) => {
  let id = randomUUID();
  let renderCount = 0;
  let playerPos = currentPlayerPos;
  let marker = config.custom.symbols.enemy;
  let pos = getRandomPos(playerPos);
  let speed = 5;
  let health = 2;
  let rewardXP = 1;
  let attackDamage = 1;

  const render = () => {
    return marker;
  }

  const move = (enemies: EnemyInterface[]) => {
    renderCount++;
    if (renderCount % speed !== 0) return;

    if(playerPos.x === pos.x && playerPos.y === pos.y) {
      // damage player.
      PlayerEmitter.emit('takeDamage', attackDamage);
      return;
    }
    if (playerPos.x < pos.x) {
      pos.x -= 1;
    }
    else if (playerPos.x > pos.x) {
      pos.x += 1
    }
    if (playerPos.y < pos.y) {
      pos.y -= 1;
    }
    else if (playerPos.y > pos.y) {
      pos.y += 1;
    }
  }

  const collides = ({ x, y }: Pos, dmg?: number) => {
    const isHit = pos.x === x && pos.y === y;
    if (dmg && isHit) {
      receiveDmg(dmg)
    }
    return isHit;
  }

  const receiveDmg = (dmg: number = 1) => {
    health -= dmg;
    if (health <= 0) {
      SpawnEmitter.emit('death', {id, pos, rewardXP});
    }
  }

  // Event Subscribers
  DisplayEmitter.addListener('render', ({enemies}) => move(enemies));
  PlayerEmitter.addListener('move', (p: Pos) => playerPos = p);

  return {
    id,
    pos,
    render,
    move,
    collides,
    rewardXP,
  }
}

export default Enemy;

