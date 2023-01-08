#!/usr/bin/env ts-node
import { printScreen } from "./src/Display";
import InputContoller from "./src/Input";
import Player from "./src/Player";
import config from "./config";
import { EnemyInterface } from "./src/Enemy";
import { createEnemySpawn, SpawnEmitter } from "./src/SpawnController";

const { display } = config;

// Game State;
const player = Player();
let enemies = createEnemySpawn();

SpawnEmitter.addListener('death', (id: any) => {
  enemies = enemies.filter((e: EnemyInterface) => e.id !== id)
});

InputContoller({player})

const run = async () => {
  const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
  while (!config.debug) {
    printScreen({ player, enemies });
    await sleep(display.refreshRate);
  }

  if(config.debug){
    console.log({
      player,
    });
    for(const e of enemies){
      console.log(e.id, {x: e.pos.x, y: e.pos.y});
    }
  }
}
run();
