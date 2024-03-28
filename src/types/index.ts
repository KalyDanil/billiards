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

export interface IPoint {
  x: number;
  y: number;
}

export interface IBallsStatus {
  id: number;
  isMoving: boolean;
}
