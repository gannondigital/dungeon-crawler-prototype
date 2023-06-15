import Item from "./item";

function validateProps({ items }) {
  return (
    Array.isArray(items) &&
    items.reduce((isValid, item) => {
      return isValid && item instanceof Item;
    }, true)
  );
}

/**
 * @todo support non-item treasure
 */
export default class Treasure {
  constructor(treasureProps) {
    const isValid = validateProps(treasureProps);
    if (!isValid) {
      throw new TypeError("Invalid props passed to Treasure constructor");
    }

    this.items = treasureProps.items;
  }

  getReceivedMessages() {
    // @todo support non-item treasure
    return this.items.map((item) => {
      return `Received ${item.getLabel()}!`;
    });
  }

  /**
   *
   * @returns {Array<Item>} Array of Item instances
   */
  getItemsForInventory() {
    return [].concat(this.items);
  }
}
