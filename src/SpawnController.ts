import { EventEmitter } from "events";
import config from "../config";
import Enemy, { EnemyInterface } from "./Enemy";
import { PlayerEmitter } from "./Player";
import { Pos } from "./types";

const enemyLimit = 4;
let totalEnemies = 0;
let playerPos = config.playerStartPos;

export const SpawnEmitter = new EventEmitter();

PlayerEmitter.addListener('move', (p: Pos) => playerPos = p);

export const createEnemySpawn = () => {
  const swarm: EnemyInterface[] = [];
  for (let i = totalEnemies; i < enemyLimit; i++) {
    swarm.push(Enemy(playerPos));
  }

  totalEnemies += swarm.length;
  return swarm;
}

// TODO could there be a race condition here ?
SpawnEmitter.on('death', () => totalEnemies -= 1);
