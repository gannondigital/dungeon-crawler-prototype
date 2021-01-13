import React, { Component } from "react";
import { PropTypes } from "prop-types";

// @todo inject the subscriber method directly?
import { characterStore } from "../stores/store-character.js";
import { Compass } from "./compass";

import "../../css/components/game-header.scss";

export class GameHeader extends Component {
  constructor(props) {
    super(props);
    const currDirection = characterStore.getDirection();
    this.state = {
      direction: currDirection
    };

    characterStore.listen(this.handleDirectionUpdate.bind(this));
  }

  handleDirectionUpdate() {
    const currDirection = characterStore.getDirection();
    this.setState({ direction: currDirection });
  }

  render() {
    const { button } = this.props;
    return (
      <header className="game_header">
        {button && button}
        <Compass direction={this.state.direction} />
      </header>
    );
  }
}

GameHeader.propTypes = {
  button: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ])
};
