import React, { Component, useState, useCallback } from "react";

import messagesStore from "../stores/messages";
import { useStoreSubscription } from "../hooks";

import "../../css/components/game-msg";

export const GameMsg = ({}) => {
  const [msgs, setMessages] = useState([]);

  const handleMsgUpdate = useCallback(
    () => setMessages(messagesStore.getCurrMsgs()),
    [setMessages, messagesStore]
  );
  useStoreSubscription([[messagesStore, handleMsgUpdate]]);

  let msgComponents = [];
  if (Array.isArray(msgs)) {
    msgComponents = msgs.map((msg) => <p key={msg}>{msg}</p>);
  }

  return <div className="game-msg--text">{msgComponents}</div>;
};
export default GameMsg;
