import events from "events";

import AppDispatcher from "../dispatcher/AppDispatcher";
import ObjectsConstants from "../constants/ObjectsConstants";

const EventEmitter = events.EventEmitter;
const CHANGE_EVENT = "change";

// All ships indexed by object ID.
const _ships = {};

// All objects (including ships) indexed by object ID.
const _objects = {};

// Each object has a unique ID. This is incremented each time a new object is created.
let _nextObjectId = 1;

class ObjectsStore extends EventEmitter {
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

  addShip(position, rotation) {
    const id = _nextObjectId++;
    const ship = {
      position,
      rotation,
      id,
    };
    _ships[id] = ship;
    _objects[id] = ship;
  }

  rotateObject(objectId, rotationChange) {
    _objects[objectId].rotation += rotationChange;
  }
}

const store = new ObjectsStore();
store.addShip({ x: 0.5, y: 0.5 }, 0);

// Register callback to handle all updates
AppDispatcher.register((action) => {
  switch (action.actionType) {
    case ObjectsConstants.OBJECTS_CREATE:
      store.addShip(action.position, action.rotation);
      store.emitChange();
      break;
    case ObjectsConstants.OBJECTS_ROTATE:
      store.rotateObject(action.objectId, action.rotationChange);
      store.emitChange();
      break;
    default:
      // no op
  }
});

export default store;
