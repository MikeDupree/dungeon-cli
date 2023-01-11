import { EventEmitter } from "events";
import config from '../config';
import { EnemyInterface } from './Enemy';
import { isBorderWall } from "./Environment";
import { ExperienceOrb } from "./ExperienceOrbs";
import { getInterfaceCharacter, isInterface } from "./Interface";
import { PlayerInterface } from './Player';

// CONFIG
const { display, custom: { symbols } } = config;
const { stdout } = process;
const { columns, rows } = stdout;

export const DisplayEmitter = new EventEmitter();

const flush = () => {
  if(config.debug) return;
  // Clear buffer history before rerender
  stdout.write("\u001b[3J\u001b[2J\u001b[1J\033[2J");
  // Faster buffer clear. (vs using console.clear)
  stdout.cursorTo(0);
  stdout.clearScreenDown();
}

interface PrintScreen {
  player: PlayerInterface;
  enemies: EnemyInterface[];
  experienceOrbs: ExperienceOrb[];
}

export const printScreen = ({ player, enemies, experienceOrbs }: PrintScreen) => {
  flush();
  let screen = '';
  for (let row = display.padding.top; row < rows - display.padding.bottom; row++) {
    for (let col = display.padding.left; col < columns - display.padding.right; col++) {
      const renderPos = { x: row, y: col };

      if (isInterface(row)) {
        screen += `${getInterfaceCharacter(col, { enemies, player })}`;
      }
      else if (isBorderWall(row, col)) {
        screen += "\x1b[33m#\x1b[0m";
      }
      else if (player.collides(renderPos)) {
        screen += player.render();
      }
      else if (player.attackCollides(renderPos)) {
        const collided = enemies.filter((e) => e.collides(renderPos, 1));

        screen += `\x1b[92m${collided.length ? '*' : player.render("attack")}\x1b[0m`;
      }
      else {
        const enemyLoc = enemies.filter((e) => e.collides(renderPos));
        if (enemyLoc.length) {
          screen += `\x1b[31m${enemies[0].render()}\x1b[0m`;
        }
        else {
          const xp = experienceOrbs.filter((e) => e.collides(renderPos));
          if (xp.length) {
            screen += xp[0].render();
          }
          else {
            screen += symbols.empty;
          }
        }
      }
    }
    screen += "\n";
  }

  DisplayEmitter.emit('render', { enemies });

  if (config.debug) return

  stdout.write(screen);
};

