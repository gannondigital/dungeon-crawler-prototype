
export class Treasure {

  constructor(treasureProps) {
    const isValid = validateProps(treasureProps);
    if (!isValid) {
      throw new TypeError('Invalid props passed to Treasure constructor');
    }

    this.name = monsterProps.name;
  }

  getReceivedMessage() {
    return `Received ${this.name}!`;
  }

  getInventory() {
    // @todo return inventory-friendly representation
    return {};
  }

}

function validateProps(monsterProps) {
  let isValid = true;
  if (!monsterProps.name) {
    isValid = false;
  }
  return isValid;
}
