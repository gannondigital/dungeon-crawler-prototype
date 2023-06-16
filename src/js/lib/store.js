import EventEmitter from "events";

const CHANGE = "CHANGE";

class Store {
  constructor() {
    this.events = new EventEmitter();
    this.data = null;
  }

  get() {
    return this.data;
  }

  listen(callback) {
    this.events.on(CHANGE, callback);
  }

  stopListening(callback) {
    this.events.removeListener(CHANGE, callback);
  }

  triggerChange() {
    this.events.emit(CHANGE);
  }
}

export default Store;
