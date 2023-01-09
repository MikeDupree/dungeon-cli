
import config from '../config';
import { EnemyInterface } from './Enemy';
import { ExperienceOrbEmitter } from './ExperienceOrbs';
import { PlayerInterface } from './Player';

// CONFIG
const { display } = config;
const { columns, rows } = process.stdout;

// interface Building
export const isInterface = (row: number) => {
  if (row === rows - display.padding.bottom - 1) return true;
};

let experience = 0;
ExperienceOrbEmitter.addListener('collected', ({ reward }) => {
  experience += reward;
});

const experienceBar = () => {
  return `XP: ${experience} \x1b[92m#\x1b[0m`;
}

export const getInterfaceCharacter = (col: number, { enemies, player }: { enemies: EnemyInterface[], player: PlayerInterface }) => {
  const message =
    ` \x1b[30mSurvivor CLI\x1b[0m (${player.pos.x},${player.pos.y}) \u001b[31m Health: 11 / 11\u001b[0m | \x1b[33m Attack: 1\x1b[0m | Enemies: ${enemies.length} | ${experienceBar()}`;
  return message.split('')?.[col] || ""
}
