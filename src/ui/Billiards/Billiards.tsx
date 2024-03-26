import { useCallback, useEffect, useRef, useState } from "react";
import { IBall, ICanvasObj, ITimer, IVector } from "../../types";
import { ballsData } from "./data";

const Billiards = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [chosenBall, setChosenBall] = useState<IBall | null>(null);

  const [balls, setBalls] = useState<IBall[]>(ballsData);

  const [timers, setTimers] = useState<ITimer[]>(() =>
    ballsData.map((item) => {
      return { ballId: item.id, value: null };
    })
  );

  const moveBall = useCallback(
    (ball: IBall, vector: IVector, ctx: CanvasRenderingContext2D | null) => {
      const getVectorSize = (x: number, y: number) => {
        return Math.round(Math.sqrt(x * x + y * y));
      };

      if (ctx) {
        let x = ball.x;
        let y = ball.y;
        const speed = ball.speed ? ball.speed : 8;

        const timer = setInterval(() => {
          setBalls((balls) => {
            ctx.clearRect(0, 0, 2000, 1000);

            ctx.fillStyle = "black";
            ctx.fillRect(10, 10, 300, 500);

            ctx.fillStyle = "green";
            ctx.fillRect(20, 20, 280, 480);

            x = x + (speed * vector.x) / getVectorSize(vector.x, vector.y);
            y = y + (speed * vector.y) / getVectorSize(vector.x, vector.y);

            const changedBall = { ...ball };
            changedBall.x = x;
            changedBall.y = y;
            changedBall.speed = speed;
            changedBall.vector = vector;

            const ballIndex = balls.findIndex((item) => item.id === ball.id);

            balls.splice(ballIndex, 1, changedBall);

            balls.forEach((ball) => {
              ctx.beginPath();
              ctx.arc(ball.x, ball.y, 10, 0, 2 * Math.PI);
              ctx.fillStyle = ball.color;
              ctx.fill();
            });

            return balls;
          });
        }, 30);

        setTimers((timers) => {
          const ballIndex = timers.findIndex((item) => item.ballId === ball.id);
          const newTimers = [...timers];

          if (ballIndex > -1) {
            newTimers.splice(ballIndex, 1, { ballId: ball.id, value: timer });
          } else {
            newTimers.push({ ballId: ball.id, value: timer });
          }

          return newTimers;
        });
      }
    },
    []
  );

  useEffect(() => {
    const borders = {
      x: 20,
      y: 20,
      width: 280,
      height: 480,
    };

    if (canvasRef.current) {
      balls.forEach((ball) => {
        const ctx = canvasRef.current?.getContext("2d");
        if (checkCollisionWithBorder(ball, borders) && ctx) {
          setTimers((timers) => {
            const timerIndex = timers.findIndex(
              (item) => item.ballId === ball.id
            );
            const timer = timers[timerIndex];

            timer?.value && clearInterval(timer?.value);

            timers.splice(timerIndex, 1, {
              ballId: timer.ballId,
              value: null,
            });
            return timers;
          });

          if (ball.speed - 2 > 0) {
            const changedBall = { ...ball };
            changedBall.speed = ball.speed - 2;
            moveBall(
              changedBall,
              { x: -ball.vector.x, y: -ball.vector.y },
              ctx
            );
            return;
          }

          const changedBall = { ...ball };
          changedBall.speed = 0;

          setBalls((balls) => {
            const ballIndex = balls.findIndex((item) => item.id === ball.id);
            return balls.splice(ballIndex, 1, changedBall);
          });
        }
      });

      // if (checkCollisionWithBorder(ball, borders)) {
      //   setTimers((timers) => {
      //     const timerIndex = timers.findIndex(
      //       (item) => item.ballId === ball.id
      //     );
      //     const timer = timers[timerIndex];

      //     timer?.value && clearInterval(timer?.value);

      //     timers.splice(timerIndex, 1, { ballId: timer.ballId, value: null });
      //     return timers;
      //   });

      //   if (ball.speed - 2 > 0) {
      //     const changedBall = { ...ball };
      //     changedBall.speed = ball.speed - 2;
      //     const ctx = canvasRef.current.getContext("2d");

      //     moveBall(changedBall, { x: -ball.vector.x, y: -ball.vector.y }, ctx);
      //     return;
      //   }

      //   const changedBall = { ...ball };
      //   changedBall.speed = 0;
      //   setBall(changedBall);
      // }
    }
  }, [balls, moveBall]);

  const checkCollisionWithBorder = (ball: IBall, border: ICanvasObj) => {
    if (
      ball.x + ball.width >= border.x + border.width ||
      ball.x - ball.width <= border.x ||
      ball.y + ball.height >= border.y + border.height ||
      ball.y - ball.height <= border.y
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onClickStart = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(10, 10, 300, 500);

        ctx.fillStyle = "green";
        ctx.fillRect(20, 20, 280, 480);

        balls.forEach((ball) => {
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, 10, 0, 2 * Math.PI);
          ctx.fillStyle = ball.color;
          ctx.fill();
        });
      }
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const ball = balls.find((item) => {
      if (
        e.pageX <= item.x + 5 &&
        e.pageX >= item.x - 5 &&
        e.pageY <= item.y + 5 &&
        e.pageY >= item.y - 5
      ) {
        return true;
      }
      return false;
    });

    if (ball) {
      setChosenBall(ball);
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (chosenBall && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");

      moveBall(
        chosenBall,
        { x: e.pageX - chosenBall.x, y: e.pageY - chosenBall.y },
        ctx
      );

      setChosenBall(null);
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={1000}
        height={550}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      ></canvas>
      <button onClick={onClickStart}>Start</button>
    </>
  );
};

export default Billiards;
