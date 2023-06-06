import React, { useCallback, useEffect } from "react";
import { PropTypes } from "prop-types";

import "../../css/components/passage-controls";

export const PassageControls = ({
  leftClickHandler,
  forwardClickHandler,
  rightClickHandler,
}) => {
  // this should be turned into a shared util, if needed again
  const handleKeyDown = useCallback(
    (evt) => {
      switch (evt.key) {
        case "ArrowLeft":
          leftClickHandler();
          break;
        case "ArrowUp":
          forwardClickHandler();
          break;
        case "ArrowRight":
          rightClickHandler();
          break;
        default:
          break;
      }
    },
    [leftClickHandler, forwardClickHandler, rightClickHandler]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <nav className="passage_controls">
      <ul>
        <li className="passage_controls--listitem">
          <button className="button_left" onClick={leftClickHandler} />
        </li>
        <li className="passage_controls--listitem">
          <button className="button_forward" onClick={forwardClickHandler} />
        </li>
        <li className="passage_controls--listitem">
          <button className="button_right" onClick={rightClickHandler} />
        </li>
      </ul>
    </nav>
  );
};
export default PassageControls;

PassageControls.propTypes = {
  leftClickHandler: PropTypes.func,
  forwardClickHandler: PropTypes.func,
  rightClickHandler: PropTypes.func,
};
