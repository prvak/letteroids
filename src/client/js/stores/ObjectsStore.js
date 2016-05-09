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

  addShip(position) {
    const id = `ship_${_nextObjectId++}`;
    this._addObject(id, position, "V");
    _shipId = id;
  }

  addAsteroid(position) {
    const id = `asteroid_${_nextObjectId++}`;
    this._addObject(id, position, "@");
  }

  _addObject(id, position, hull) {
    const speed = {
      x: 0.01,
      y: 0.0,
      r: 0.0,
    };
    const acceleration = {
      x: 0.0,
      y: 0.0,
      r: 0.0,
    };
    const object = Immutable.fromJS({
      id,
      ts: this._getTimestamp(),
      initialPosition: position,
      initialSpeed: speed,
      speed,
      acceleration,
      position,
      hull,
    });
    _objects = _objects.set(id, object);
  }

  rotateObject(objectId, rotationSpeed) {
    let object = _objects.get(objectId);
    const now = this._getTimestamp();
    const currentSpeed = this._computeCurrentSpeed(object, now);
    currentSpeed.r = rotationSpeed;
    const currentPosition = this._computeCurrentPosition(object, now);
    object = object.set("initialPosition", new Immutable.Map(currentPosition));
    object = object.set("position", new Immutable.Map(currentPosition));
    object = object.set("initialSpeed", new Immutable.Map(currentSpeed));
    object = object.set("speed", new Immutable.Map(currentSpeed));
    object = object.set("ts", now);
    _objects = _objects.set(objectId, object);
  }

  accelerateObject(objectId, force) {
    let object = _objects.get(objectId);
    const now = this._getTimestamp();
    const currentSpeed = this._computeCurrentSpeed(object, now);
    const currentPosition = this._computeCurrentPosition(object, now);
    const angle = currentPosition.r * 2 * Math.PI;
    const acceleration = {
      x: force * Math.sin(angle),
      y: -force * Math.cos(angle),
      r: 0.0,
    }
    console.log(force, angle, acceleration);
    object = object.set("initialPosition", new Immutable.Map(currentPosition));
    object = object.set("position", new Immutable.Map(currentPosition));
    object = object.set("initialSpeed", new Immutable.Map(currentSpeed));
    object = object.set("speed", new Immutable.Map(currentSpeed));
    object = object.set("ts", now);
    object = object.set("acceleration", new Immutable.Map(acceleration));
    _objects = _objects.set(objectId, object);
  }

  handleTick() {
    const now = this._getTimestamp();
    const newObjects = {};
    if (_lastTickTimestamp === null) {
      _objects.forEach((object) => {
        const objectId = object.get("id");
        newObjects[objectId] = this._updateTimestamp(object, now);
      });
    } else {
      _objects.forEach((object) => {
        const objectId = object.get("id");
        const currentPosition = this._computeCurrentPosition(object, now);
        newObjects[objectId] = object.set("position", new Immutable.Map(currentPosition));
      });
    }
    _objects = new Immutable.Map(newObjects);
    _lastTickTimestamp = now;
  }

  _computeCurrentPosition(object, now) {
    const ts = object.get("ts");
    const t = (now - ts) / 1000;
    const initialSpeed = object.get("initialSpeed");
    const initialPosition = object.get("initialPosition");
    const acceleration = object.get("acceleration");
    const currentPosition = {};
    ["x", "y", "r"].forEach((dimension) => {
      const p = initialPosition.get(dimension);
      const v = initialSpeed.get(dimension);
      const a = acceleration.get(dimension);
      // Compute distance traveled by a constantly accelerated object.
      // s = a*(t^2)/2 + v*t
      const s = a * t * t / 2 + v * t;
      // Normalize to interval [0:1].
      currentPosition[dimension] = (p + s) % 1.0;
    });
    return currentPosition;
  }

  _computeCurrentSpeed(object, now) {
    const ts = object.get("ts");
    const t = (now - ts) / 1000;
    const initialSpeed = object.get("initialSpeed");
    const acceleration = object.get("acceleration");
    const currentSpeed = {};
    ["x", "y", "r"].forEach((dimension) => {
      const v = initialSpeed.get(dimension);
      const a = acceleration.get(dimension);
      // Compute speed of a constantly accelerated object.
      // u = a*t
      const u = a * t;
      currentSpeed[dimension] = v + u;
    });
    return currentSpeed;
  }

  _updateTimestamp(object, now) {
    return object.set("timestamp", now);
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

  _getTimestamp() {
    return Date.now();
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
    case ObjectsConstants.OBJECTS_ACCELERATE_SHIP:
      store.accelerateObject(_shipId, action.force);
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
