// super duper mocked out for now, in-memory JSON only

export const itemsService = {
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
          return resolve(require("../data/level-one-items.json"));
        default:
          reject();
      }
    });
  }
};
