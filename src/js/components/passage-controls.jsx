import React, { Component } from "react";
import { PropTypes } from "prop-types";

import "../../css/components/passage-controls";

export const PassageControls = props => {
  return (
    <nav className="passage_controls">
      <ul>
        <li className="passage_controls--listitem">
          <button className="button_left" onClick={props.leftClickHandler} />
        </li>
        <li className="passage_controls--listitem">
          <button
            className="button_forward"
            onClick={props.forwardClickHandler}
          />
        </li>
        <li className="passage_controls--listitem">
          <button className="button_right" onClick={props.rightClickHandler} />
        </li>
      </ul>
    </nav>
  );
};

PassageControls.propTypes = {
  leftClickHandler: PropTypes.func,
  forwardClickHandler: PropTypes.func,
  rightClickHandler: PropTypes.func
};
