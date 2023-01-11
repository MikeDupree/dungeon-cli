
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
  const currentLevel = playerLevels.filter(level => experience >= level.levelAtExperience && experience < level.experience).pop();
  if (!currentLevel) return "?"
  const percentage = experience - currentLevel.levelAtExperience / currentLevel.experience * 100 / 5;
  let progressBar = new Array<string>(20);
  progressBar.fill(' ');
  for (let i = 0; i < percentage; i++) {
   progressBar[i] = '#'; 
  }
  return `[\x1b[92m${progressBar.join('')}\x1b[0m]`;
}

const experienceBar = () => {
  const currentLevel = playerLevels.filter(level => experience >= level.levelAtExperience && experience < level.experience).pop();
  if (!currentLevel) return "?"
  return `Level: ${currentLevel.level} XP: ${experience - currentLevel.levelAtExperience} / ${currentLevel.experience} ${getLevelProgessBar()} \x1b[92m#\x1b[0m`;
}

export const getInterfaceCharacter = (col: number, { enemies, player }: { enemies: EnemyInterface[], player: PlayerInterface }) => {
  const message =
    ` \x1b[30mSurvivor CLI\x1b[0m (${player.pos.x},${player.pos.y}) \u001b[31m Health: 11 / 11\u001b[0m | \x1b[33m Attack: 1\x1b[0m | Enemies: ${enemies.length} | ${experienceBar()}`;
  return message.split('')?.[col] || ""
}
