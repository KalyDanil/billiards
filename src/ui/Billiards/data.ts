import { IBall } from "../../types";

export const canvasData = {
  width: 300,
  height: 500,
};

export const ballsData: IBall[] = [
  {
    id: 0,
    x: 100,
    y: 100,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 7,
    color: "#0D47CA",
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
  },
  {
    id: 1,
    x: 125,
    y: 100,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 10,
    color: "#FF0000",
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
  },
  {
    id: 2,
    x: 150,
    y: 100,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 8,
    color: "#FFFF00",
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
  },
  {
    id: 3,
    x: 175,
    y: 100,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 12,
    color: "#FF9900",
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
  },
  {
    id: 4,
    x: 110,
    y: 125,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 9,
    color: "#FF00FF",
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
  },
  {
    id: 5,
    x: 135,
    y: 125,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 6,
    color: "#9900FF",
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
  },
  {
    id: 6,
    x: 160,
    y: 125,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 15,
    color: "#FFFFFF",
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
  },
  {
    id: 7,
    x: 120,
    y: 150,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 13,
    color: "#660000",
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
  },
  {
    id: 8,
    x: 145,
    y: 150,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 9,
    color: "#00FFFF",
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
  },
  {
    id: 9,
    x: 130,
    y: 175,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 11,
    color: "#000000",
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
  },
];
