import config from '../config';

// CONFIG
const { display } = config;
const { columns, rows } = process.stdout;

// Environment Building
export const isBorderWall = (row: number, col: number) => {
  if (row === display.padding.top || row === rows - display.padding.bottom - 2) return true;
  if (col === display.padding.left || col === columns - display.padding.right - 1) return true;
};
