import events from "events";

import AppDispatcher from "../dispatcher/AppDispatcher";
import OBJECTS_CREATE from "../constants/ObjectsConstants";

const EventEmitter = events.EventEmitter;
const CHANGE_EVENT = "change";

let _objects = 0;

class ObjectsStore extends EventEmitter {
  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll() {
    return _objects;
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  /**
   * @param {function} callback
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * @param {function} callback
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

const store = new ObjectsStore();

// Register callback to handle all updates
AppDispatcher.register((action) => {
  var text;

  switch(action.actionType) {
    case ObjectsConstants.ADD_OBJECT:
      _objects += 1;
      store.emitChange();
      break;

    default:
      // no op
  }
});

export default store;
