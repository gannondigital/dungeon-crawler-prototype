// super duper mocked out for now, this would be a network call or 
// local db lookup IRL

const levelService = {
  getLevel: async levelName => {
      if (!levelName || typeof levelName !== "string") {
        throw new TypeError("Invalid level name provided to level service");
      }

      // @todo genericize, turn into a real thing
      switch (levelName) {
        case "one":
          return require("../data/level-one");
        default:
          throw new ReferenceError(`Could not find level ${levelName}`);
      }
    });
  }
};

export default levelService;