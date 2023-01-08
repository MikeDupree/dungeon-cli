import config from "../config";
import { CharacterInterface, Pos } from "./types";
import { PlayerEmitter } from "./Player";
import { DisplayEmitter } from "./Display";
import { SpawnEmitter } from "./SpawnController";
import { randomUUID } from "crypto";


export interface EnemyInterface extends Omit<CharacterInterface, "collides"> {
  id: any,
  move: (playerPos: Pos) => void;
  collides: (pos: Pos, dmg?: number) => boolean;
}

// Enemy
const Enemy = () => {
  let id = randomUUID();
  let renderCount = 0;
  let playerPos = { x: 0, y: 0 };
  let marker = config.custom.symbols.enemy;
  let pos = {
    x: 30,
    y: 30
  }
  let speed = 5;
  let health = 2;

  const render = () => {
    return marker;
  }

  const move = () => {
    renderCount++;
    if (renderCount % speed !== 0) return;

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
      SpawnEmitter.emit('death', id);
    }
  }

  // Event Subscribers
  DisplayEmitter.addListener('render', move);
  PlayerEmitter.addListener('move', (p: Pos) => playerPos = p);

  return {
    id,
    pos,
    render,
    move,
    collides
  }
}

export default Enemy;

