import { useCallback, useState } from "react";
import { IBall, IBallsStatus, IPoint } from "../../types";
import { ballsData, canvasData } from "./data";
import "./Billiards.css";
import BallMenu from "../BallMenu";
import Help from "../Help";

const Billiards = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [editingBallIndex, setEditingBallIndex] = useState<number>(-1);

  const readyStatus = "Нанесите удар";
  const waitingStatus = "Ожидание конца хода...";

  let balls = [...ballsData];

  let blowIsMade = false;

  let raf: number;

  const speedLossesDueToPush = 1;
  const startSpeed = 8;
  const speedLossesDueToFriction = 0.01;

  let chosenBallIndex = -1;

  const canvasRef = useCallback((canvasNode: HTMLCanvasElement) => {
    if (canvasNode) {
      const ctx = canvasNode.getContext("2d");

      if (!ctx) {
        return;
      }

      ballsData.forEach((item) => item.draw(ctx));

      setCanvas(canvasNode);
    }
  }, []);

  const findBallIndexByClick = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!canvas) {
      return -1;
    }

    return balls.findIndex(
      (ball) =>
        Math.pow(ball.x + canvas.getBoundingClientRect().x - e.pageX, 2) +
          Math.pow(ball.y + canvas.getBoundingClientRect().y - e.pageY, 2) <=
        Math.pow(ball.radius, 2)
    );
  };

  const onContextMenu = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();

    chosenBallIndex = findBallIndexByClick(e);

    if (chosenBallIndex > -1 && !blowIsMade) {
      setEditingBallIndex(chosenBallIndex);
      setMenuIsOpen(true);
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (blowIsMade || !canvas) {
      return;
    }

    chosenBallIndex = findBallIndexByClick(e);
  };

  const drawArrow = (start: IPoint, end: IPoint) => {
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const arrowHeadWidth = 15;

    const PI = Math.PI;
    const degreesInRadians225 = (225 * PI) / 180;
    const degreesInRadians135 = (135 * PI) / 180;

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);

    const x225 = end.x + arrowHeadWidth * Math.cos(angle + degreesInRadians225);
    const y225 = end.y + arrowHeadWidth * Math.sin(angle + degreesInRadians225);
    const x135 = end.x + arrowHeadWidth * Math.cos(angle + degreesInRadians135);
    const y135 = end.y + arrowHeadWidth * Math.sin(angle + degreesInRadians135);

    ctx.clearRect(0, 0, canvasData.width, canvasData.height);

    balls.forEach((item) => item.draw(ctx));

    ctx.beginPath();

    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);

    ctx.moveTo(end.x, end.y);
    ctx.lineTo(x225, y225);

    ctx.moveTo(end.x, end.y);
    ctx.lineTo(x135, y135);

    ctx.stroke();
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (chosenBallIndex === -1 || blowIsMade || !canvas) {
      return;
    }

    const chosenBall = balls[chosenBallIndex];
    drawArrow(
      {
        x: chosenBall.x,
        y: chosenBall.y,
      },
      {
        x: e.pageX - canvas.getBoundingClientRect().x,
        y: e.pageY - canvas.getBoundingClientRect().y,
      }
    );
  };

  const onMouseLeave = () => {
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasData.width, canvasData.height);

    balls.forEach((item) => item.draw(ctx));

    chosenBallIndex = -1;
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (chosenBallIndex === -1 || blowIsMade || !canvas) {
      return;
    }
    const chosenBall = balls[chosenBallIndex];

    const vector = {
      x: e.pageX - (chosenBall.x + canvas.getBoundingClientRect().x),
      y: e.pageY - (chosenBall.y + canvas.getBoundingClientRect().y),
    };

    const getVectorSize = (x: number, y: number) => {
      return Math.round(Math.sqrt(x * x + y * y));
    };

    chosenBall.vx = vector.x / getVectorSize(vector.x, vector.y);
    chosenBall.vy = vector.y / getVectorSize(vector.x, vector.y);

    chosenBall.speed = startSpeed;

    blowIsMade = true;

    changeGameStatus(waitingStatus);

    raf = window.requestAnimationFrame(drawMove);
  };

  const changeGameStatus = (status: string) => {
    const gameStatus = document.getElementById("gameStatus");
    if (gameStatus) {
      gameStatus.innerText = status;
    }
  };

  const drawMove = () => {
    const ctx = canvas?.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasData.width, canvasData.height);

    let ballsStatus: IBallsStatus[] = [];

    balls.forEach((item) => {
      item.draw(ctx);
      ballsStatus.push({
        id: item.id,
        isMoving: calcBallMove(item),
      });
    });

    if (ballsStatus.find((item) => item.isMoving)) {
      raf = window.requestAnimationFrame(drawMove);
      return;
    }

    blowIsMade = false;
    chosenBallIndex = -1;
    window.cancelAnimationFrame(raf);
    changeGameStatus(readyStatus);
  };

  const checkCollisionWithBalls = (ball: IBall) => {
    const getDistance = (ball1: IBall, ball2: IBall) => {
      return Math.sqrt(
        Math.pow(ball1.x + ball1.vx - ball2.x, 2) +
          Math.pow(ball1.y + ball1.vy - ball2.y, 2)
      );
    };

    const pushedBall = balls.find((item) => {
      if (ball.id === item.id) {
        return false;
      }

      return getDistance(ball, item) <= ball.radius + item.radius;
    });

    if (pushedBall) {
      pushedBall.vx += ball.vx;
      pushedBall.vy += ball.vy;
      pushedBall.speed = Math.abs(pushedBall.speed - ball.speed) - 0.5;

      ball.vx = -ball.vx;
      ball.vy = -ball.vy;
      ball.speed -= speedLossesDueToPush;
    }
  };

  const checkCollisionWithBorders = (ball: IBall) => {
    if (
      ball.x + ball.vx >= canvasData.width - ball.radius ||
      ball.x + ball.vx - ball.radius <= 0
    ) {
      ball.vx = -ball.vx;
      ball.speed -= speedLossesDueToPush;
    }

    if (
      ball.y + ball.vy >= canvasData.height - ball.radius ||
      ball.y + ball.vy - ball.radius <= 0
    ) {
      ball.vy = -ball.vy;
      ball.speed -= speedLossesDueToPush;
    }
  };

  const calcBallMove = (ball: IBall) => {
    let isMoving = true;

    if (ball.speed <= 0.5) {
      ball.speed = 0;
      ball.vx = 0;
      ball.vy = 0;

      isMoving = false;
      return isMoving;
    }

    checkCollisionWithBorders(ball);

    checkCollisionWithBalls(ball);

    ball.speed -= ball.speed * speedLossesDueToFriction;

    ball.x += ball.vx * ball.speed;
    ball.y += ball.vy * ball.speed;

    return isMoving;
  };

  return (
    <div className="billiards">
      {menuIsOpen && (
        <BallMenu
          ballIndex={editingBallIndex}
          menuIsOpen={menuIsOpen}
          setMenuIsOpen={setMenuIsOpen}
          canvas={canvas}
          balls={balls}
        />
      )}
      <h1 className="billiards__header">
        Бильярд <Help />
      </h1>
      <canvas
        ref={canvasRef}
        id="canvas"
        className="billiards__canvas"
        width={canvasData.width}
        height={canvasData.height}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onContextMenu={onContextMenu}
      />
      <div id="gameStatus" className="billiards__gameStatus">
        {readyStatus}
      </div>
    </div>
  );
};

export default Billiards;
