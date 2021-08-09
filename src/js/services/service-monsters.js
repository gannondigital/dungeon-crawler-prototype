// super duper mocked out for now, in-memory JSON only

export const monsterService = {
  getMonsters: levelName => {
    return new Promise((resolve, reject) => {
      if (!levelName || typeof levelName !== "string") {
        return reject(
          new TypeError("Invalid level name provided to monster service")
        );
      }

      // @todo genericize, turn into a real thing
      switch (levelName) {
        case "one":
          return resolve(require("../data/level-one-monsters"));
        default:
          reject();
      }
    });
  }
};
