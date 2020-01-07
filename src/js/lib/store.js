import { default as EventEmitter } from "events";

const changeSlug = "change";

export const Store = function() {
  this.events = new EventEmitter();
};
Store.prototype.get = function get() {
  return this.data;
};
Store.prototype.listen = function listen(cb) {
  this.events.on(changeSlug, cb);
};
Store.prototype.stopListening = function stopListening(cb) {
  this.events.removeListener(changeSlug, cb);
};
Store.prototype.triggerChange = function triggerChange() {
  this.events.emit(changeSlug);
};
