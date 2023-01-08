#!/usr/bin/env npx ts-node

const { Readable } = require('node:stream');
var keypress = require('keypress');

const { stdin } = process;
// without this, we would only get streams once enter is pressed
stdin.setRawMode(true);

console.log('hello there');
console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows);
const { columns, rows } = process.stdout;

// configA
// screen configurables
const rowEndingModifier = 3;

// game configurables
const refreshRate = 1000;
const wall = "#";
const player = "&";
const empty = " ";
const xp = "·";

const isBorderWall = (row: number, col: number) => {
  if (row === 0 || row === rows - rowEndingModifier - 1) return true;
  if (col === 0 || col === columns - 1) return true;
}

const printScreen = () => {
  for (let row = 0; row < rows - rowEndingModifier; row++) {
    for (let col = 0; col < columns; col++) {
      if (isBorderWall(row, col)) {
        process.stdout.write(wall);
      } else {
        process.stdout.write(empty);
      }
    }
    process.stdout.write("\n");
  }
}

// TODO play around with reading this buffer.
//const readable = Readable.from(process.stdin);
//readable.on('data', (chunk: any) => {
//  console.log('chunk', chunk);
//});
keypress(process.stdin);
process.stdin.on('keypress', function(ch, key) {
  // Kill process on Ctl-C 
  if ( key.sequence === '\x03' ) {
    process.exit();
  }
  console.log("here's the key object", key);
})

const run = async () => {
  const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
  while (true) {
    // console.clear();
    // printScreen();
    await sleep(refreshRate);
  }
}
run();
