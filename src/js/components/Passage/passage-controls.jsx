import React, { useCallback, useState } from "react";
import { PropTypes } from "prop-types";
import classNames from "classnames";

import "../../../css/components/Passage/passage-controls";
import { useWindowKeydown } from "../../hooks";

export const PassageControls = ({
  validateMoveAhead,
  onTurnLeft,
  onTurnRight,
  onMoveAhead,
  changePassageView,
}) => {
  const [activeButton, setActiveButton] = useState(null);
  const handleLeftClick = useCallback(async () => {
    await changePassageView(onTurnLeft);
  }, [onTurnLeft]);
  const handleRightClick = useCallback(async () => {
    await changePassageView(onTurnRight);
  }, [onTurnRight]);
  const handleForwardClick = useCallback(async () => {
    if (!validateMoveAhead()) {
      return;
    }

    await changePassageView(onMoveAhead);
  }, [onMoveAhead, validateMoveAhead]);

  const handleKeyDown = useCallback(
    async (keyPressed) => {
      switch (keyPressed) {
        case "arrowleft":
          setActiveButton("left");
          await handleLeftClick();
          setActiveButton(null);
          break;
        case "arrowright":
          setActiveButton("right");
          await handleRightClick();
          setActiveButton(null);
          break;
        case "arrowup":
          setActiveButton("forward");
          await handleForwardClick();
          setActiveButton(null);
          break;
        default:
          break;
      }
    },
    [handleLeftClick, handleRightClick, handleForwardClick]
  );
  useWindowKeydown(handleKeyDown);
  const leftClasses = classNames({
    button_left: true,
    active: activeButton === "left",
  });
  const rightClasses = classNames({
    button_right: true,
    active: activeButton === "right",
  });
  const forwardClasses = classNames({
    button_forward: true,
    active: activeButton === "forward",
  });

  return (
    <nav className="passage_controls">
      <ul>
        <li className="passage_controls--listitem">
          <button className={leftClasses} onClick={handleLeftClick} />
        </li>
        <li className="passage_controls--listitem">
          <button className={forwardClasses} onClick={handleForwardClick} />
        </li>
        <li className="passage_controls--listitem">
          <button className={rightClasses} onClick={handleRightClick} />
        </li>
      </ul>
    </nav>
  );
};
export default PassageControls;

PassageControls.propTypes = {
  validateMoveAhead: PropTypes.func.isRequired,
  onTurnLeft: PropTypes.func.isRequired,
  onTurnRight: PropTypes.func.isRequired,
  onMoveAhead: PropTypes.func.isRequired,
  changePassageView: PropTypes.func.isRequired,
};
