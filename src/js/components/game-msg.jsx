import React, { Component } from "react";

import { msgStore } from "../stores/store-messages";

import "../../css/components/game-msg";

// @todo set display duration based on message count
export default class GameMsg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgs: []
    };
  }

  handleMsgUpdate = () => {
    const msgs = msgStore.getCurrMsgs();
    this.setState({ msgs });
  };

  componentDidMount() {
    msgStore.listen(this.handleMsgUpdate);
  }

  componentWillUnmount() {
    msgStore.stopListening(this.handleMsgUpdate);
  }

  render() {
    const { msgs } = this.state;

    let msgComponents = null;
    if (Array.isArray(msgs)) {
      msgComponents = msgs.map(msg => {
        return <p key={msg}>{msg}</p>;
      });
    }

    return <div className="game-msg--text">{msgComponents}</div>;
  }
}
