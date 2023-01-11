
import config from '../config';
import { EnemyInterface } from './Enemy';
import { ExperienceOrbEmitter } from './ExperienceOrbs';
import { PlayerInterface, PlayerLevels } from './Player';

// CONFIG
const { display } = config;
const { columns, rows } = process.stdout;

const playerLevels = PlayerLevels;

// interface Building
export const isInterface = (row: number) => {
  if (row === rows - display.padding.bottom - 1) return true;
};

let experience = 0;
ExperienceOrbEmitter.addListener('collected', ({ reward }) => {
  experience += reward;
});

const getLevelProgessBar = () => {
  const currentLevel = playerLevels.filter(level => level.experience >= currentLevel);
  return JSON.stringify(currentLevel);
  const percentage = experience / currentLevel.experience * 100;
  return Math.ceil(percentage);
}
const experienceBar = () => {
  const currentLevel = playerLevels.filter(level => level.experience > currentLevel)?.pop();
  return `Level: ${currentLevel} XP: ${experience} ${getLevelProgessBar()} \x1b[92m#\x1b[0m`;
}

export const getInterfaceCharacter = (col: number, { enemies, player }: { enemies: EnemyInterface[], player: PlayerInterface }) => {
  const message =
    ` \x1b[30mSurvivor CLI\x1b[0m (${player.pos.x},${player.pos.y}) \u001b[31m Health: 11 / 11\u001b[0m | \x1b[33m Attack: 1\x1b[0m | Enemies: ${enemies.length} | ${experienceBar()}`;
  return message.split('')?.[col] || ""
}
