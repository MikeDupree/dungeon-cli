
export interface Pos {
  x: number;
  y: number;
}

export interface CharacterInterface extends Collidable {
  render: (mode?: "attack") => string;
}

export interface Renderable {
  render: () => string;
}

export interface Collidable {
  pos: Pos;
  collides: (pos: Pos) => boolean;
}
