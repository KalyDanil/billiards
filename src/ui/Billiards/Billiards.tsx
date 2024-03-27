import { useCallback, useEffect, useRef, useState } from "react";
import { IBall, IBallsStatus, ICanvasObj, ITimer, IVector } from "../../types";
import { ballsData } from "./data";
import "./Billiards.css";

const Billiards = () => {
  // const canvasRef = useRef<HTMLCanvasElement>(null);

  const [canvas, setCanvas] = useState<HTMLCanvasElement>();

  let balls = [...ballsData];

  let blowIsMade = false;

  let raf: number;

  const canvasData = {
    width: 300,
    height: 500,
    top: 10,
    left: 10,
  };

  const speedLossesDueToPush = 1;
  const startSpeed = 6;
  const speedLossesDueToFriction = 0.01;

  const readyStatus = "Нанесите удар";
  const waitingStatus = "Идет удар";

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

  const checkCollisionWithBalls = (ball: IBall) => {
    const getDistance = (ball1: IBall, ball2: IBall) => {
      return Math.sqrt(
        Math.pow(ball1.x + ball1.vx - ball2.x, 2) +
          Math.pow(ball1.y + ball1.vy - ball2.y, 2)
      );
    };

    const pushedBallIndex = balls.findIndex((item) => {
      if (ball.id === item.id) {
        return false;
      }

      return getDistance(ball, item) <= ball.radius + item.radius;
    });

    if (pushedBallIndex > -1) {
      const pushedBall = { ...balls[pushedBallIndex] };

      pushedBall.vx = ball.vx;
      pushedBall.vy = ball.vy;
      pushedBall.speed += ball.speed - 1;

      balls.splice(pushedBallIndex, 1, pushedBall);

      return true;
    }

    return false;
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
      isMoving = false;
      return isMoving;
    }

    checkCollisionWithBorders(ball);

    if (checkCollisionWithBalls(ball)) {
      ball.vx = -ball.vx;
      ball.vy = -ball.vy;
      ball.speed -= speedLossesDueToPush;
    }

    ball.speed -= ball.speed * speedLossesDueToFriction;

    ball.x += ball.vx * ball.speed;
    ball.y += ball.vy * ball.speed;

    return isMoving;
  };

  const animate = () => {
    const ctx = canvas?.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasData.width, canvasData.height);

    const ballsStatus: IBallsStatus[] = [];

    balls.forEach((item) => {
      item.draw(ctx);
      ballsStatus.push({
        id: item.id,
        isMoving: calcBallMove(item),
      });
    });

    if (ballsStatus.find((item) => item.isMoving)) {
      raf = window.requestAnimationFrame(animate);
      return;
    }

    blowIsMade = false;
    chosenBallIndex = -1;
    window.cancelAnimationFrame(raf);
    changeGameStatus(readyStatus);
  };

  const onClickReset = () => {
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvasData.width, canvasData.height);
    balls = [...ballsData];
    balls.forEach((item) => item.draw(ctx));

    blowIsMade = false;
    chosenBallIndex = -1;
    changeGameStatus(readyStatus);
    window.cancelAnimationFrame(raf);
  };

  const changeGameStatus = (status: string) => {
    const gameStatus = document.getElementById("gameStatus");

    if (gameStatus) {
      gameStatus.innerText = status;
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (blowIsMade) {
      return;
    }

    chosenBallIndex = balls.findIndex(
      (ball) =>
        Math.pow(ball.x - e.pageX, 2) + Math.pow(ball.y - e.pageY, 2) <=
        Math.pow(ball.radius, 2)
    );
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (chosenBallIndex === -1 || blowIsMade || !canvas) {
      return;
    }

    const chosenBall = { ...balls[chosenBallIndex] };

    const vector = { x: e.pageX - chosenBall.x, y: e.pageY - chosenBall.y };

    const getVectorSize = (x: number, y: number) => {
      return Math.round(Math.sqrt(x * x + y * y));
    };

    chosenBall.vx = vector.x / getVectorSize(vector.x, vector.y);
    chosenBall.vy = vector.y / getVectorSize(vector.x, vector.y);

    chosenBall.speed = startSpeed;

    balls.splice(chosenBallIndex, 1, chosenBall);

    blowIsMade = true;

    changeGameStatus(waitingStatus);

    raf = window.requestAnimationFrame(animate);
  };

  return (
    <div className="billiards">
      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid",
          backgroundColor: "green",
        }}
        width={canvasData.width}
        height={canvasData.height}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
      <div id="gameStatus">{readyStatus}</div>
      <button id="resetButton" onClick={onClickReset}>
        Перезапустить
      </button>
    </div>
  );
};

export default Billiards;
