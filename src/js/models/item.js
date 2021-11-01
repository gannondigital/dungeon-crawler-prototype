
// @todo
function isValidProps(itemProps) {
  return true;
}

export default class Item {
  constructor(props) {
    if (!isValidProps(props)) {
      throw new TypeError("Invalid props passed to Item constructor");
    }
    const {
      meta,
      itemRoles,
      types,
      bulkSize,
      isOwned,
      isEquipped,
      equipsToSlot
    } = props;
    this.meta = {};
    this.meta.name = meta.name;
    this.meta.label = meta.label;
    // @todo review this
    this.meta.imageUrl = require(`../../img/items/${meta.imageUrl}`);
    this.itemRoles = itemRoles || ["item"];
    this.types = types || ["normal"];
    this.bulkSize = bulkSize;
    this.isOwned = isOwned || false;
    this.isEquipped = isEquipped;
    this.equipsToSlot = equipsToSlot || null;
  }

  hasRole(role) {
    // for convenience, allow single role or array
    const roles = typeof role === "string" ? [role] : role;
    return roles.reduce((acc, role) => {
      return acc || !!(this.itemRoles.indexOf(role) !== -1);
    }, false);
  }

  getName() {
    return this.meta.name;
  }

  getLabel() {
    return this.meta.label;
  }

  getImageUrl() {
    return this.meta.imageUrl;
  }

  getRoles() {
    return [].concat(this.itemRoles);
  }
}
