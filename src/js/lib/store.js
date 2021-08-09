import EventEmitter from "events";

const CHANGE = "CHANGE";

const Store = function() {
  this.events = new EventEmitter();
};
Store.prototype.get = function get() {
  return this.data;
};
Store.prototype.listen = function listen(cb) {
  this.events.on(CHANGE, cb);
};
Store.prototype.stopListening = function stopListening(cb) {
  this.events.removeListener(CHANGE, cb);
};
Store.prototype.triggerChange = function triggerChange() {
  this.events.emit(CHANGE);
};

export default Store;