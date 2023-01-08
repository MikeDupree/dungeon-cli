
import config from '../config';
import { DisplayEmitter } from './Display';

// CONFIG
const { display } = config;
const { columns, rows } = process.stdout;
let enemyCount = 0;

DisplayEmitter?.addListener('render', ({enemies}) => {enemyCount = enemies.length});

const message = `= Survivor CLI  Health: 10 | Attack: 1 | Enemies: ${enemyCount} `;
// interface Building
export const isInterface = (row: number) => {
  if (row === rows - display.padding.bottom - 1) return true;
};

export const getInterfaceCharacter = (col: number) =>{
 return message.split('')?.[col] || "="
}
