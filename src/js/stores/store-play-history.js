import { default as isEqual } from "lodash.isEqual";
import { default as cloneDeep } from "lodash.cloneDeep";

import { Store } from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import * as constants from "../config/constants-actions";

const findEventInEventlist = (eventName, eventList) => {
  return eventList.reduce((foundEvent, eventObj) => {
    return foundEvent || eventObj.eventName === eventName;
  });
};

class PlayHistoryStore extends Store {
  handleAction = action => {
    switch (action.type) {
      case constants.ADD_TO_HISTORY:
        const { tileName, eventName } = action.payload;
        if (!tileName || typeof tileName !== "string") {
          throw new TypeError("Invalid tilename sent to PlayHistoryStore");
        }

        const dataByTile = this.data.byTile;

        dataByTile[tileName] = dataByTile[tileName] || [];
        dataByTile[tileName].push({
          tileName,
          eventName
        });
        console.log(`event:${JSON.stringify({ tileName, eventName })}`);

        break;
      default:
        break;
    }
  };

  constructor() {
    super();
    this.dispatchToken = dispatcher.register(this.handleAction);
    this.data = {
      byTile: {}
    };
  }

  getTileEvent(tileName, eventName) {
    if (
      !tileName ||
      typeof tileName !== "string" ||
      !eventName ||
      typeof eventName !== "string"
    ) {
      throw new ReferenceError(
        "tileName or eventName missing in call to getTileEvent"
      );
    }
    const tileData = this.data.byTile[tileName]
      ? this.data.byTile[tileName]
      : null;
    if (!tileData) {
      return null;
    }

    const eventOccurred = findEventInEventlist(eventName, tileData);
    return eventOccurred;
  }
}

export const playHistoryStore = new PlayHistoryStore();
