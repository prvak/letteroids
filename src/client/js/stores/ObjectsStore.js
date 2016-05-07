import events from "events";
import Immutable from "immutable";

import AppDispatcher from "../dispatcher/AppDispatcher";
import ObjectsConstants from "../constants/ObjectsConstants";

const EventEmitter = events.EventEmitter;
const CHANGE_EVENT = "change";

// All objects indexed by object ID.
let _objects = new Immutable.Map({});

// Each object has a unique ID. This is incremented each time a new object is created.
let _nextObjectId = 1;
let _lastTickTimestamp = null;
let _shipId = null;

class ObjectsStore extends EventEmitter {
  getShips() {
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

  _generateId() {
    return
  }

  addShip(position) {
    const id = `ship_${_nextObjectId++}`;
    const speed = {
      x: 0.01, // screens/second
      y: 0.01, // screens/second
      r: 0.1, // degrees/second
    };
    const ship = new Immutable.Map({
      position: new Immutable.Map(position),
      speed: new Immutable.Map(speed),
      id,
      hull: "V",
    });
    _objects = _objects.set(id, ship);
    _shipId = id;
  }

  addAsteroid(position) {
    const id = `asteroid_${_nextObjectId++}`;
    const speed = {
      x: 0.01, // screens/second
      y: 0.01, // screens/second
      r: 0.1, // cycles/second
    };
    const asteroid = new Immutable.Map({
      position: new Immutable.Map(position),
      speed: new Immutable.Map(speed),
      id,
      hull: "@",
    });
    _objects = _objects.set(id, asteroid);
  }

  rotateObject(objectId, rotationChange) {
    const object = _objects.get(objectId);
    const positionChange = {
      x: 0,
      y: 0,
      r: rotationChange,
    };
    const newObject = this._changePosition(object, positionChange);
    _objects = _objects.set(objectId, newObject);
  }

  handleTick() {
    const now = Date.now();
    if (_lastTickTimestamp !== null) {
      const timeSinceLastTick = now - _lastTickTimestamp;
      const newObjects = {};
      _objects.forEach((object) => {
        const objectId = object.get("id");
        const speed = object.get("speed");
        const positionChange = {};
        ["x", "y", "r"].forEach((dimension) => {
          const movement = speed.get(dimension) * timeSinceLastTick / 1000;
          positionChange[dimension] = movement;
        });
        const newObject = this._changePosition(object, positionChange);
        newObjects[objectId] = newObject;
      });
      _objects = new Immutable.Map(newObjects);
    }
    _lastTickTimestamp = now;
  }

  _changePosition(object, positionChange) {
    const position = object.get("position");
    const newPosition = {};
    ["x", "y", "r"].forEach((dimension) => {
      let newValue = position.get(dimension) + positionChange[dimension];
      newValue = ((newValue * 100) % 100) / 100;
      newPosition[dimension] = newValue;
    });
    return object.set("position", new Immutable.Map(newPosition));
  }
}

const store = new ObjectsStore();
store.addShip({ x: 0.5, y: 0.5, r: 0.0 });

// Register callback to handle all updates
AppDispatcher.register((action) => {
  switch (action.actionType) {
    case ObjectsConstants.OBJECTS_ADD_ASTEROID:
      store.addAsteroid(action.position, action.speed);
      store.emitChange();
      break;
    case ObjectsConstants.OBJECTS_ROTATE_SHIP:
      store.rotateObject(_shipId, action.rotationChange);
      store.emitChange();
      break;
    case ObjectsConstants.OBJECTS_TICK:
      store.handleTick();
      store.emitChange();
      break;
    default:
      // no op
  }
});

export default store;
