#!/usr/bin/env ts-node
import { printScreen } from "./src/Display";
import InputContoller from "./src/Input";
import Player, { PlayerEmitter } from "./src/Player";
import config from "./config";
import { EnemyInterface } from "./src/Enemy";
import { createEnemySpawn, SpawnEmitter } from "./src/SpawnController";
import experienceOrb, { ExperienceOrb, ExperienceOrbEmitter } from "./src/ExperienceOrbs";

const { display } = config;

// Game State;
const player = Player();
let enemies = createEnemySpawn();
let experienceOrbs = [];

SpawnEmitter.addListener('death', ({id, pos, rewardXP}: any) => {
  enemies = enemies.filter((e: EnemyInterface) => e.id !== id)
  experienceOrbs.push(experienceOrb(pos, rewardXP));
});

ExperienceOrbEmitter.addListener('collected', ({id}) => {
  experienceOrbs = experienceOrbs.filter((orb: ExperienceOrb) => orb.id !== id);
});

InputContoller({player})

const run = async () => {
  const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
  while (true) {
    printScreen({ player, enemies, experienceOrbs });
    await sleep(display.refreshRate);
  }
}
run();
