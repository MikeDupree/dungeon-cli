import { EventEmitter } from "events";
import config from '../config';
import { EnemyInterface } from './Enemy';
import { isBorderWall } from "./Environment";
import { getInterfaceCharacter, isInterface } from "./Interface";
import { PlayerInterface } from './Player';

// CONFIG
const { display, custom: { symbols } } = config;
const { stdout } = process;
const { columns, rows } = stdout;

export const DisplayEmitter = new EventEmitter();

const flush = () => {
  // Clear buffer history before rerender
  stdout.write("\u001b[3J\u001b[2J\u001b[1J");
  // Faster buffer clear. (vs using console.clear)
  stdout.cursorTo(0);
  stdout.clearScreenDown();
}

interface PrintScreen {
  player: PlayerInterface;
  enemies: EnemyInterface[];
}

export const printScreen = ({ player, enemies }: PrintScreen) => {
  flush();
  let screen = '';
  for (let row = display.padding.top; row < rows - display.padding.bottom; row++) {
    for (let col = display.padding.left; col < columns - display.padding.right; col++) {
      const renderPos = { x: row, y: col };

      if (isInterface(row)) {
        screen += `\x1b[33m${getInterfaceCharacter(col, { enemies, player })}\x1b[0m`;
      }
      else if (isBorderWall(row, col)) {
        screen += "\x1b[33m#\x1b[0m";
      }
      else if (player.collides(renderPos)) {
        screen += `\x1b[92m${player.render()}\x1b[0m`;
      }
      else if (player.attackCollides(renderPos)) {
        const collided = enemies.filter((e) => e.collides(renderPos, 1));

        screen += `\x1b[92m${collided.length ? '*' : player.render("attack")}\x1b[0m`;
      }
      else {
        const enemyLoc = enemies.filter((e) => e.collides(renderPos));
        if (enemyLoc.length) {
          screen += `\x1b[31m${enemies[0].render()}\x1b[0m`;
        } else {
          screen += symbols.empty;
        }
      }
    }
    screen += "\n";
  }

  stdout.write(screen);

  DisplayEmitter.emit('render', { enemies });
};

