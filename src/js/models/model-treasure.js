import cloneDeep from "lodash.cloneDeep";

export class Treasure {

  constructor(treasureProps) {
    const isValid = validateProps(treasureProps);
    if (!isValid) {
      throw new TypeError('Invalid props passed to Treasure constructor');
    }

    this.items = treasureProps.items && treasureProps.items.length ? treasureProps.items : [];
  }

  getReceivedMessages() {
    // @todo support non-item treasure
    return this.items.map((item) => {
      return `Received ${item.getName()}!`;
    });
  }

  getItemsForInventory() {
    return cloneDeep(this.items);
  }

}

function validateProps(treasureProps) {
  return true;
}
