import { useEffect, useMemo, useState } from "react";
import { IBall } from "../../types";
import "./BallMenu.css";
import { canvasData } from "../Billiards/data";

const BallMenu: React.FC<{
  ballIndex: number;
  menuIsOpen: boolean;
  setMenuIsOpen: (status: boolean) => void;
  canvas: HTMLCanvasElement | undefined;
  balls: IBall[];
}> = ({ ballIndex, menuIsOpen, setMenuIsOpen, canvas, balls }) => {
  const ball = useMemo(() => balls[ballIndex], [ballIndex, balls]);

  const [color, setColor] = useState<string>(ball ? ball.color : "#000000");

  useEffect(() => {
    const ballMenu = document.getElementById("ballMenu");

    if (!ballMenu || !ball || !canvas) {
      return;
    }

    ballMenu.style.top = `${ball.y + canvas.getBoundingClientRect().y}px`;
    ballMenu.style.left = `${ball.x + canvas.getBoundingClientRect().x}px`;
  }, [ball, canvas]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ctx = canvas?.getContext("2d");
    const ball = balls[ballIndex];

    if (!ctx || !ball) {
      return;
    }

    setColor(e.target.value);

    ball.color = e.target.value;

    ctx.clearRect(0, 0, canvasData.width, canvasData.height);

    balls.forEach((item) => item.draw(ctx));
  };

  const onClick = () => {
    if (menuIsOpen) {
      setMenuIsOpen(false);
    }
  };

  return (
    <div className="backgroundClickHandler" onClick={onClick}>
      <div
        id="ballMenu"
        className="ballMenu"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          className="ballMenu__closeIcon"
          src="/icons/close.svg"
          alt="close"
          onClick={() => setMenuIsOpen(false)}
        />
        <div className="ballMenu__header">
          <span>Настройка шара</span>
        </div>
        <div>
          <label htmlFor="colorInput">Цвет шара: </label>
          <input
            id="colorInput"
            type="color"
            value={color}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default BallMenu;
