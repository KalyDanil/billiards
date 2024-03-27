export interface ICanvasObj {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IBall {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  color: string;
  radius: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface IVector {
  x: number;
  y: number;
}

export interface ITimer {
  ballId: number;
  value: NodeJS.Timer | null;
}

export interface IBallsStatus {
  id: number;
  isMoving: boolean;
}
