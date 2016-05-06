import events from "events";

import AppDispatcher from "../dispatcher/AppDispatcher";
import ObjectsConstants from "../constants/ObjectsConstants";

const EventEmitter = events.EventEmitter;
const CHANGE_EVENT = "change";

const _ships = [];
let _nextId = 1;

class ObjectsStore extends EventEmitter {
  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getShips() {
    return _ships;
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
  console.log("Dispatching:", action);
  switch (action.actionType) {
    case ObjectsConstants.OBJECTS_CREATE:
      _ships.push({
        position: action.position,
        id: _nextId++,
      });
      store.emitChange();
      break;

    default:
      // no op
  }
});

export default store;
