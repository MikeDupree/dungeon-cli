import { randomUUID } from "crypto";
import { EventEmitter } from "stream";
import { PlayerEmitter } from "./Player";
import { Pos, Renderable, Collidable } from "./types";

export interface ExperienceOrb extends Renderable, Collidable {
  id: string;
  reward: number;
}

export const ExperienceOrbEmitter = new EventEmitter();

const experienceOrb = (position: Pos, experience?: number): ExperienceOrb => {
  let collected = false;
  const id = randomUUID();
  const reward = experience > 0 ? experience : 1;
  const symbol = '*';
  const pos = { x: position.x, y: position.y };

  const collides = ({ x, y }: Pos) => (x === pos.x && y == pos.y);

  const render = () => `${symbol}`

  PlayerEmitter.addListener('move', (playerPos) => {
    if (!collected && pos.x === playerPos.x || pos.y === playerPos.y) {
      collected = true;
      ExperienceOrbEmitter.emit('collected', { id, reward });
    }
  });

  return {
    id,
    reward,
    pos,
    collides,
    render,
  }
}

export default experienceOrb;
