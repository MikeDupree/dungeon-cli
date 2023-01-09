
import config from '../config';
import { DisplayEmitter } from './Display';
import { EnemyInterface } from './Enemy';
import { PlayerInterface } from './Player';

// CONFIG
const { display } = config;
const { columns, rows } = process.stdout;

// interface Building
export const isInterface = (row: number) => {
  if (row === rows - display.padding.bottom - 1) return true;
};

export const getInterfaceCharacter = (col: number, { enemies, player }: { enemies: EnemyInterface[], player: PlayerInterface }) => {
  const message = `= Survivor CLI  Health: 10 | Attack: 1 | Enemies: ${enemies.length} `;
  return message.split('')?.[col] || "="
}
