// super duper mocked out for now, this would be a network call or 
// local db lookup IRL

import itemsStore from "../stores/items";

const itemsService = {
  getItems: levelName => {
    return new Promise((resolve, reject) => {
      if (!levelName || typeof levelName !== "string") {
        return reject(
          new TypeError("Invalid level name provided to items service")
        );
      }

      // @todo genericize, turn into a real thing
      switch (levelName) {
        case "one":
          return resolve(require("../data/level-one-items"));
        default:
          reject();
      }
    });
  }
};

export default itemsService;
