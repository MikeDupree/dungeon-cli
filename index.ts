#!/usr/bin/env npx ts-node

import chalk from 'chalk';
import Player from "./src/Player";
import config from "./config";
var keypress = require('keypress');

const { stdin } = process;
// without this, we would only get streams once enter is pressed
stdin.setRawMode(true);

console.log('hello there');
console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows);
const { columns, rows } = process.stdout;

const { display, custom: {symbols} } = config;

// Game State;
const player = Player();

// Environment Building
const isBorderWall = (row: number, col: number) => {
  if (row === 0 || row === rows - display.padding.bottom - 1) return true;
  if (col === 0 || col === columns - 1) return true;
};

const printScreen = () => {
  console.clear();
  for (let row = display.padding.top; row < rows - display.padding.bottom; row++) {
    for (let col = 0; col < columns; col++) {
      if (isBorderWall(row, col)) {
        process.stdout.write("\x1b[33m#\x1b[0m");
      }
      else if (player.collides(row, col)) {
        process.stdout.write(`\x1b[92m${player.render()}\x1b[0m`);
      } else {
        process.stdout.write(symbols.empty);
      }
    }
    process.stdout.write("\n");
  }
};

// Input Controller
//
// TODO play around with reading this buffer.
//const readable = Readable.from(process.stdin);
//readable.on('data', (chunk: any) => {
//  console.log('chunk', chunk);
//});
keypress(process.stdin);
process.stdin.on('keypress', function(ch, key) {
  // Kill process on Ctl-C 
  if (key.sequence === '\x03') {
    process.exit();
  }

  player.checkMovement(key.sequence);
})

const run = async () => {
  const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
  while (true) {
    printScreen();
    await sleep(display.refreshRate);
  }
}
run();
