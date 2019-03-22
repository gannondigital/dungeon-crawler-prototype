// - meta 
//   - name
//   - imageUrl
// - itemRoles[] // weapon, item, magical, etc.
// - types[] // normal, fire, lightning, etc.
// - bulkSize
// - isOwned
// - isEquipped
// - equipsToSlot

export default class Item {

  constructor(props) {
    if (!isValidProps(props)) {
      throw new TypeError('Invalid props passed to Item constructor');
    }

    this.initialize(props);
  }

  initialize(props) {
    this.meta = {};
    this.meta.name = props.meta.name;
    this.meta.imageUrl = props.meta.imageUrl;
    this.itemRoles = props.itemRoles || ['item'];
    this.types = props.types || ['normal'];
    this.bulkSize = props.bulkSize;
    this.isOwned = props.isOwned || false;
    this.isEquipped = props.isEquipped;
    this.equipsToSlot = props.equipsToSlot || null;
  }

  hasRole(role) {
    // for convenience, allow single role or array
    const roles = typeof role === 'string' ? [ role ] : role;
    return roles.reduce((acc, role) => {
      return acc || !!(this.itemRoles.indexOf(role) !== -1);
    }, false);
  }

  getName() {
    return this.meta.name;
  }

  getImageUrl() {
    return this.meta.imageUrl;
  }

  getRoles() {
    return [].concat(this.itemRoles);
  }

}

function isValidProps(itemProps) {
  // @todo
  return true;
}