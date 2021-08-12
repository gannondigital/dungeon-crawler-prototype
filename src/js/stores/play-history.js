import isEqual from "lodash.isEqual";
import cloneDeep from "lodash.cloneDeep";

import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import constants from "../constants/actions";

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

const playHistoryStore = new PlayHistoryStore();
// @todo this code is ridiculous and in every store
playHistoryStore.dispatchToken = dispatcher.register(action => {
  switch (action.type) {
    case constants.ITEMS_LOADED:
      const oldLevel = playHistoryStore.data.levelName;
      const newLevel = action.payload.levelName;

      if (oldLevel === newLevel) {
        return;
      }
      playHistoryStore.data.levelName = newLevel;
      playHistoryStore.data.itemsByName = action.payload.items;

      playHistoryStore.triggerChange();
      break;
    default:
      break;
  }
});

export default playHistoryStore;