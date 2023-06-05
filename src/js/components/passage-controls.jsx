import React, { Component } from "react";
import { PropTypes } from "prop-types";

import "../../css/components/passage-controls";

export default class PassageControls extends Component {
  handleKeyDown = (evt) => {
    const { leftClickHandler, forwardClickHandler, rightClickHandler } =
      this.props;

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
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    const { leftClickHandler, forwardClickHandler, rightClickHandler } =
      this.props;

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
  }
}

PassageControls.propTypes = {
  leftClickHandler: PropTypes.func,
  forwardClickHandler: PropTypes.func,
  rightClickHandler: PropTypes.func,
};
