export interface ICanvasObj {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IBall extends ICanvasObj {
  id: number;
  color: string;
  speed: number;
  vector: {
    x: number;
    y: number;
  };
}

export interface IVector {
  x: number;
  y: number;
}

export interface ITimer {
  ballId: number;
  value: NodeJS.Timer | null;
}
