import { useEffect, useState } from "react";
import "./Help.css";

const Help = () => {
  const [helpIsOpen, setHelpIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const clickHandler = () => {
      setHelpIsOpen(false);
    };

    if (helpIsOpen) {
      document.body.addEventListener("click", clickHandler);
    } else {
      document.body.removeEventListener("click", clickHandler);
    }
  }, [helpIsOpen]);

  return (
    <div className="help" onClick={(e) => e.stopPropagation()}>
      <img
        className="help__icon"
        src="/icons/help.svg"
        alt="help"
        onClick={() => setHelpIsOpen(!helpIsOpen)}
      />
      {helpIsOpen && (
        <div className="help__info">
          <img
            className="help__closeIcon"
            src="/icons/close.svg"
            alt="help"
            onClick={() => setHelpIsOpen(false)}
          />
          <div>Нанесение удара:</div>
          <ol>
            <li>дождитесь окончания хода;</li>
            <li>наведите мышь на шар;</li>
            <li>нажмите и удерживайте левую кнопку мыши;</li>
            <li>выберите направление удара;</li>
            <li>отпустите кнопку;</li>
          </ol>
          <div>Настройка шара:</div>
          <ol>
            <li>дождитесь окончания хода;</li>
            <li>нажмите правой кнопкой мыши по нужному шару;</li>
            <li>измените нужные параметры;</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default Help;
