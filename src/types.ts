
export interface Pos {
  x: number;
  y: number;
}

export interface CharacterInterface {
  pos: Pos;
  render: (mode?: "attack") => string;
  collides: (pos: Pos) => boolean;
}
