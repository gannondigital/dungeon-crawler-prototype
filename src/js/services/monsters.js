// super duper mocked out for now, this would be a network call or
// local db lookup IRL

const monsterService = {
  getMonsters: async (levelName) => {
    if (!levelName || typeof levelName !== "string") {
      throw new TypeError("Invalid level name provided to monster service");
    }

    // @todo genericize, turn into a real thing
    switch (levelName) {
      case "one":
        return require("../data/level-one-monsters");
      default:
        throw new ReferenceError(`Could not identify level ${levelName}`);
    }
  },
};

export default monsterService;
