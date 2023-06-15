import Treasure from "../models/treasure";
import ItemFactory from "./item-factory";

/**
 * @param {Array<String>} Array of item names
 * @returns {Boolean}
 */
function validateItemNames(itemNames) {
  return (
    Array.isArray(itemNames) &&
    itemNames.reduce((isValid, item) => {
      return isValid && typeof item === "string" && item;
    }, true)
  );
}

/**
 * Instantiates a Treasure. Responsible for business context of treasure
 * creation
 * @param  {Object} - itemNames Array of item name strings
 * @return {Treasure}
 */
export const TreasureFactory = ({ items: itemNames }) => {
  // @todo rm/improve validation
  if (!validateItemNames(itemNames)) {
    throw new TypeError("Invalid args passed to TreasureFactory");
  }

  const items = itemNames.map((itemName) => ItemFactory(itemName));
  return new Treasure({ items });
};

export default TreasureFactory;
