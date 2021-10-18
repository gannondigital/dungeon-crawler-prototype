
import Store from "../lib/store";
import { dispatcher } from "../lib/game-dispatcher";
import { ADD_TO_HISTORY } from "../constants/actions";

const findEventInEventlist = (eventName, eventList) => {
  return eventList.reduce((foundEvent, eventObj) => {
    return foundEvent || eventObj.eventName === eventName;
  });
};

// @todo is this really enough for keeping track of everything that the 
// player has done/that has occurred? Probably too flat and will end up
// being a more domain-specific abstraction
class PlayHistoryStore extends Store {
  handleAction = action => {
    const { type, payload } = action;
    switch (type) {
      // @todo are there 'play history' events that aren't associated
      // with a Tile?
      // @todo validate eventName
      case ADD_TO_HISTORY:
        const { tileName, eventName } = payload;
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
    this.data = {
      byTile: {}
    };
    this.dispatchToken = dispatcher.register(this.handleAction);
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
    const historyByTile = this.data.byTile[tileName]
      ? this.data.byTile[tileName]
      : null;
    if (!historyByTile) {
      return null;
    }

    // @todo are we storing one event per tile? that would obviously
    // not scale
    return historyByTile.find(tileEvent => {
      return tileEvent === eventName;
    });
  }
}

const playHistoryStore = new PlayHistoryStore();
export default playHistoryStore;