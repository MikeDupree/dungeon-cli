#!/usr/bin/env npx ts-node
import { printScreen } from "./src/Display";
import InputContoller from "./src/Input";
import Player, { PlayerEmitter } from "./src/Player";
import config from "./config";
import Enemy, { EnemyInterface } from "./src/Enemy";
import { SpawnEmitter } from "./src/SpawnController";
var keypress = require('keypress');


const { display, custom: { symbols } } = config;

// Game State;
const player = Player();
let enemies = [
  Enemy(),
]

SpawnEmitter.addListener('death', (id: any) => {
  console.log("DEATH");
  enemies = enemies.filter((e: EnemyInterface) => e.id !== id)
});

InputContoller({player})

const run = async () => {
  const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
  while (!config.debug) {
    printScreen({ player, enemies });
    await sleep(display.refreshRate);
  }
}
run();
